```json
// package.json
{
  "name": "stripe-webhook-handler",
  "version": "1.0.0",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^5.3.0",
    "stripe": "^23.0.0"
  }
}
```

```js
// server.js
const express = require('express');
const Stripe = require('stripe');

const app = express();
const port = process.env.PORT || 3000;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
const TOLERANCE_SECONDS = 300; // reject events signed more than 5 minutes ago (replay protection)

// Raw body is required for signature verification
app.post('/webhooks/stripe', express.raw({ type: 'application/json' }), (req, res) => {
  // 1. Verify the signature FIRST, before acknowledging anything.
  //    constructEvent checks the HMAC-SHA256 signature (timing-safe) and the
  //    signed timestamp against the tolerance window.
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body, // raw Buffer, not parsed JSON
      req.headers['stripe-signature'],
      WEBHOOK_SECRET,
      TOLERANCE_SECONDS
    );
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).send('Invalid signature');
  }

  // 2. Dedupe by event ID (providers retry and may deliver duplicates)
  if (processedEvents.has(event.id)) {
    console.log(`Skipping duplicate event: ${event.id}`);
    return res.status(200).json({ received: true, duplicate: true });
  }
  processedEvents.add(event.id);

  // 3. Acknowledge immediately, then process asynchronously
  res.status(200).json({ received: true });

  setImmediate(() => {
    handleEvent(event).catch((err) => {
      // Already acknowledged: log for retry/reconciliation (e.g. push to a job queue or dead-letter log)
      console.error(`Error handling ${event.type} (${event.id}):`, err.message);
    });
  });
});

// --- Idempotency Store (in-memory stub; use a durable store such as a DB table in production) ---

const processedEvents = new Set();

// --- Event Handlers ---

async function handleEvent(event) {
  switch (event.type) {
    case 'checkout.session.completed':
      return handleCheckoutCompleted(event.data.object);
    case 'invoice.payment_failed':
      return handlePaymentFailed(event.data.object);
    case 'customer.subscription.deleted':
      return handleSubscriptionDeleted(event.data.object);
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
}

async function handleCheckoutCompleted(session) {
  console.log(`Checkout completed for customer: ${session.customer}`);
  console.log(`Amount: ${session.amount_total / 100} ${session.currency.toUpperCase()}`);
  // TODO: Provision access, send confirmation email
}

async function handlePaymentFailed(invoice) {
  console.log(`Payment failed for invoice: ${invoice.id}`);
  console.log(`Customer: ${invoice.customer}, Amount due: ${invoice.amount_due / 100}`);
  // TODO: Notify customer, schedule retry
}

async function handleSubscriptionDeleted(subscription) {
  console.log(`Subscription cancelled: ${subscription.id}`);
  console.log(`Customer: ${subscription.customer}`);
  // TODO: Revoke access, send cancellation email
}

// --- Default route for non-webhook traffic ---

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Webhook server listening on http://localhost:${port}`);
});
```

```json
// package.json
{
  "name": "stripe-webhook-handler",
  "version": "1.0.0",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.0"
  }
}
```

```js
// server.js
const express = require('express');
const crypto = require('crypto');

const app = express();
const port = process.env.PORT || 3000;

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

// Raw body is required for signature verification
app.post('/webhooks/stripe', express.raw({ type: 'application/json' }), (req, res) => {
  // Always respond 200 quickly to prevent retries
  res.status(200).json({ received: true });

  // Verify signature
  const signature = req.headers['stripe-signature'];
  if (!verifySignature(req.body, signature)) {
    console.error('Invalid webhook signature');
    return;
  }

  const event = JSON.parse(req.body.toString());

  // Idempotency check
  if (processedEvents.has(event.id)) {
    console.log(`Skipping duplicate event: ${event.id}`);
    return;
  }
  processedEvents.add(event.id);

  // Route to handler
  handleEvent(event).catch((err) => {
    console.error(`Error handling ${event.type} (${event.id}):`, err.message);
  });
});

// --- Signature Verification ---

function verifySignature(payload, header) {
  if (!header || !WEBHOOK_SECRET) return false;

  const parts = header.split(',').reduce((acc, part) => {
    const [key, value] = part.split('=');
    acc[key] = value;
    return acc;
  }, {});

  const timestamp = parts['t'];
  const expectedSig = parts['v1'];

  const signedPayload = `${timestamp}.${payload.toString()}`;
  const computedSig = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(signedPayload)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(computedSig),
    Buffer.from(expectedSig)
  );
}

// --- Idempotency Store (in-memory stub) ---

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

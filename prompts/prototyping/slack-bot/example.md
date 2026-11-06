```json
// package.json
{
  "name": "slack-status-bot",
  "version": "1.0.0",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^5.1.0"
  }
}
```

```js
// server.js
const express = require('express');
const crypto = require('crypto');

const app = express();
const port = process.env.PORT || 3000;

const SIGNING_SECRET = process.env.SLACK_SIGNING_SECRET;
const BOT_TOKEN = process.env.SLACK_BOT_TOKEN; // for Web API calls (e.g. chat.postMessage) if you extend the bot

// Raw body is required for signature verification
app.use('/slack', express.raw({ type: 'application/x-www-form-urlencoded' }));
app.use(express.urlencoded({ extended: true }));

function verifySlackSignature(req) {
  const timestamp = req.headers['x-slack-request-timestamp'];
  const slackSignature = req.headers['x-slack-signature'];
  if (!SIGNING_SECRET || !timestamp || !slackSignature) return false;

  // Reject missing/non-numeric timestamps and anything more than 5 minutes from now (replay protection)
  const ts = Number(timestamp);
  const now = Math.floor(Date.now() / 1000);
  if (!Number.isInteger(ts) || Math.abs(now - ts) > 300) {
    return false;
  }

  const sigBaseString = `v0:${timestamp}:${req.body.toString()}`;
  const mySignature = 'v0=' + crypto
    .createHmac('sha256', SIGNING_SECRET)
    .update(sigBaseString)
    .digest('hex');

  const expected = Buffer.from(mySignature);
  const received = Buffer.from(slackSignature);
  // timingSafeEqual throws if lengths differ, so check first
  if (expected.length !== received.length) return false;
  return crypto.timingSafeEqual(expected, received);
}

async function checkHealth() {
  const start = Date.now();
  const res = await fetch('http://localhost:8080/health', { signal: AbortSignal.timeout(5000) });
  const latency = Date.now() - start;

  if (!res.ok) {
    return { ok: false, message: 'Degraded performance', details: `Health endpoint returned ${res.status}` };
  }

  return { ok: true, message: 'All systems operational', details: `Health endpoint returned ${res.status} | Latency: ${latency}ms` };
}

app.post('/slack/commands', async (req, res) => {
  if (!verifySlackSignature(req)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  const body = new URLSearchParams(req.body.toString());
  const command = body.get('command');
  const responseUrl = body.get('response_url');

  if (command !== '/status') {
    return res.status(200).json({ response_type: 'ephemeral', text: 'Unknown command.' });
  }

  // Acknowledge within 3 seconds
  res.status(200).send();

  try {
    const health = await checkHealth();

    await fetch(responseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }, // response_url needs no token
      body: JSON.stringify({
        response_type: 'ephemeral',
        text: health.message,
        attachments: [{ color: health.ok ? '#2eb67d' : '#e01e5a', text: health.details }]
      })
    });
  } catch (err) {
    await fetch(responseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        response_type: 'ephemeral',
        text: 'Status check failed. Please try again or contact on-call.',
        attachments: [{ color: '#e01e5a', text: err.message }]
      })
    });
  }
});

app.listen(port, () => {
  console.log(`Slack bot listening on http://localhost:${port}`);
});
```

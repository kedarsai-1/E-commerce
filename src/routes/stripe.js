const express = require('express');
const Stripe = require('stripe');
const { userAuth } = require('../middleware/auth');

const stripeRouter = express.Router();

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    const err = new Error(`Missing required env var: ${name}`);
    err.statusCode = 500;
    throw err;
  }
  return value;
}

function toUnitAmount(value) {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return null;

  // Always treat incoming price as INR major units
  return Math.round(n * 100);
}


/**
 * POST /stripe/create-checkout-session
 *
 * Expected body (flexible):
 * {
 *   "items": [
 *     { "name": "T-Shirt", "price": 499, "quantity": 2, "image": "https://..." }
 *   ],
 *   "currency": "inr",
 *   "successUrl": "https://frontend/success",
 *   "cancelUrl": "https://frontend/cancel"
 * }
 *
 * Response:
 * { "url": "https://checkout.stripe.com/..." }
 */
stripeRouter.post('/create-checkout-session', userAuth, async (req, res) => {
  try {
    const secretKey = requireEnv('STRIPE_SECRET_KEY');
    const stripe = new Stripe(secretKey);

    const currency = (req.body?.currency || 'inr').toString().toLowerCase();
    const items = Array.isArray(req.body?.items) ? req.body.items : [];
    if (items.length === 0) {
      return res.status(400).json({ error: 'items[] is required' });
    }

    const line_items = items.map((item) => {
      const name = (item?.name || '').toString().trim();
      const quantity = Number(item?.quantity ?? 1);
      const unit_amount = toUnitAmount(item?.unit_amount ?? item?.price);

      if (!name) throw new Error('Each item must have a name');
      if (!Number.isInteger(quantity) || quantity < 1) throw new Error('Each item quantity must be an integer >= 1');
      if (!unit_amount) throw new Error('Each item must have a positive price/unit_amount');

      const image = item?.image ? item.image.toString() : null;

      return {
        price_data: {
          currency,
          product_data: {
            name,
            ...(image ? { images: [image] } : {}),
          },
          unit_amount,
        },
        quantity,
      };
    });

    const frontendUrl = process.env.FRONTEND_URL || null;
    const successUrl = (req.body?.successUrl || (frontendUrl ? `${frontendUrl}/checkout/success` : null))?.toString();
    const cancelUrl = (req.body?.cancelUrl || (frontendUrl ? `${frontendUrl}/checkout/cancel` : null))?.toString();

    if (!successUrl || !cancelUrl) {
      return res.status(400).json({
        error: 'successUrl and cancelUrl are required (or set FRONTEND_URL on backend)',
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      success_url: successUrl,
      cancel_url: cancelUrl,
      // Helps you correlate sessions to a logged-in user
      client_reference_id: req.user?._id?.toString(),
    });

    return res.json({ url: session.url, id: session.id });
  } catch (err) {
    return res.status(err.statusCode || 500).json({ error: err.message });
  }
});

module.exports = { stripeRouter };

# Stripe Payment Integration Setup Guide

## Backend Environment Variables

Add these variables to your `backend/.env` file:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_YOUR_STRIPE_SECRET_KEY_HERE
STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_STRIPE_PUBLISHABLE_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

## Frontend Environment Variables

Add these variables to your `frontend/.env` file:

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_STRIPE_PUBLISHABLE_KEY_HERE
```

## Stripe Webhook Setup

1. Go to your Stripe Dashboard
2. Navigate to Developers > Webhooks
3. Add endpoint: `https://yourdomain.com/api/payments/webhook`
4. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
5. Copy the webhook secret and update `STRIPE_WEBHOOK_SECRET` in your .env file

## Installation Commands

### Backend
```bash
cd backend
npm install stripe
```

### Frontend
```bash
cd frontend
npm install @stripe/stripe-js @stripe/react-stripe-js
```

## Testing

Use Stripe test cards:
- Success: 4242 4242 4242 4242
- Decline: 4000 0000 0000 0002
- Requires authentication: 4000 0025 0000 3155

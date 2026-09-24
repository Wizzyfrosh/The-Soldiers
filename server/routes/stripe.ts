import { Router } from 'express';
import { prisma } from '../db.js';

export const stripeRouter = Router();

// POST /api/stripe/create-checkout-session
stripeRouter.post('/create-checkout-session', async (req, res) => {
  try {
    const { amount, frequency, fund, donorName, email } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Valid donation amount is required.' });
    }

    const stripeSecret = process.env.STRIPE_SECRET_KEY;
    const isPlaceholder = !stripeSecret || stripeSecret.includes('xxxxxxxx');

    // If Stripe is configured with a real live/test key
    if (!isPlaceholder) {
      try {
        // Dynamic import of Stripe if installed/configured
        const { default: Stripe } = await import('stripe');
        const stripe = new Stripe(stripeSecret);

        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          mode: frequency === 'monthly' ? 'subscription' : 'payment',
          customer_email: email,
          line_items: [
            {
              price_data: {
                currency: 'usd',
                product_data: {
                  name: `Soldiers of Jesus Christ - ${fund || 'General Offering'}`,
                  description: `${frequency === 'monthly' ? 'Monthly Partner' : 'One-Time Seed'} for the Kingdom`
                },
                unit_amount: Math.round(parseFloat(amount) * 100),
                ...(frequency === 'monthly' && {
                  recurring: { interval: 'month' }
                })
              },
              quantity: 1
            }
          ],
          metadata: {
            donorName: donorName || 'Kingdom Partner',
            email: email || '',
            fund: fund || 'General Fund',
            frequency: frequency || 'one-time'
          },
          success_url: `${process.env.VITE_SITE_URL || 'http://localhost:3000'}/give?status=success&session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${process.env.VITE_SITE_URL || 'http://localhost:3000'}/give?status=cancelled`
        });

        return res.json({ url: session.url, id: session.id });
      } catch (stripeErr: any) {
        console.warn('Stripe checkout API error (falling back to direct recording):', stripeErr.message);
      }
    }

    // Fallback / Sandbox Demo mode: Record directly in database
    const donation = await prisma.donation.create({
      data: {
        donorName: donorName || 'Anonymous Kingdom Partner',
        email: email || 'partner@soldiersofjesuschrist.org',
        amount: parseFloat(amount),
        frequency: frequency?.toUpperCase() === 'MONTHLY' ? 'MONTHLY' : 'ONE_TIME',
        fund: fund || 'General Fund',
        status: 'Completed',
        stripeTxId: `sim_tx_${Date.now()}`
      }
    });

    return res.json({
      message: 'Donation processed in demo/sandbox mode.',
      mock: true,
      donation
    });
  } catch (error: any) {
    console.error('Create checkout session error:', error);
    return res.status(500).json({ error: 'Failed to initiate payment session.' });
  }
});

// POST /api/stripe/webhook
stripeRouter.post('/webhook', async (req, res) => {
  try {
    const event = req.body;

    // Handle checkout.session.completed
    if (event.type === 'checkout.session.completed') {
      const session = event.data?.object;
      if (session) {
        const metadata = session.metadata || {};
        const amount = session.amount_total ? session.amount_total / 100 : 0;

        await prisma.donation.create({
          data: {
            donorName: metadata.donorName || session.customer_details?.name || 'Kingdom Partner',
            email: metadata.email || session.customer_details?.email || 'unknown@example.com',
            amount,
            frequency: metadata.frequency === 'monthly' ? 'MONTHLY' : 'ONE_TIME',
            fund: metadata.fund || 'General Fund',
            status: 'Completed',
            stripeTxId: session.id
          }
        });
        console.log(`✅ Recorded donation from Stripe webhook: $${amount}`);
      }
    }

    return res.json({ received: true });
  } catch (err: any) {
    console.error('Stripe webhook error:', err);
    return res.status(400).json({ error: 'Webhook processing failed.' });
  }
});

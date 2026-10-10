import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '../../../../lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, frequency = 'ONE_TIME', fund = 'General Ministry Fund', donorName = '', donorEmail = '' } = body;

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount < 1) {
      return NextResponse.json({ error: 'Please provide a valid donation amount ($1.00 minimum).' }, { status: 400 });
    }

    const unitAmount = Math.round(parsedAmount * 100);
    const origin = req.headers.get('origin') || process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const isSubscription = frequency === 'MONTHLY';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: isSubscription ? 'subscription' : 'payment',
      customer_email: donorEmail || undefined,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: unitAmount,
            product_data: {
              name: `Soldiers of Jesus Christ — ${fund}`,
              description: isSubscription ? 'Monthly Recurring Partnership' : 'One-Time Church Offering / Seed',
            },
            ...(isSubscription && {
              recurring: {
                interval: 'month',
              },
            }),
          },
          quantity: 1,
        },
      ],
      metadata: {
        fund,
        donorName: donorName || 'Anonymous Believer',
        donorEmail: donorEmail || '',
        frequency,
      },
      success_url: `${origin}/give?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/give?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe checkout session error:', error);
    return NextResponse.json({ error: error.message || 'Failed to initiate Stripe checkout session.' }, { status: 500 });
  }
}

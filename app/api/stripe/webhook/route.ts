import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '../../../../lib/stripe';
import { prisma } from '../../../../auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event;

  try {
    if (webhookSecret && !webhookSecret.startsWith('whsec_xxx')) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } else {
      // In development fallback if testing without live CLI secret
      event = JSON.parse(body);
    }
  } catch (err: any) {
    console.error('⚠️ Stripe Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any;
        const amountTotal = (session.amount_total || 0) / 100;
        const metadata = session.metadata || {};
        const isRecurring = session.mode === 'subscription';

        await prisma.donation.create({
          data: {
            donorName: metadata.donorName || session.customer_details?.name || 'Anonymous Giver',
            email: metadata.donorEmail || session.customer_details?.email || 'unspecified@soldiers.org',
            amount: amountTotal,
            frequency: isRecurring ? 'MONTHLY' : 'ONE_TIME',
            fund: metadata.fund || 'General Ministry Fund',
            status: 'Completed',
            stripeTxId: session.id,
            customerId: typeof session.customer === 'string' ? session.customer : session.customer?.id,
            subscriptionId: typeof session.subscription === 'string' ? session.subscription : session.subscription?.id,
          },
        });

        console.log(`✅ Recorded church donation: $${amountTotal} from ${session.customer_details?.email || 'Anonymous'}`);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as any;
        const subId = subscription.id;

        // Update records associated with this subscription
        await prisma.donation.updateMany({
          where: { subscriptionId: subId },
          data: { status: 'Failed' },
        });

        console.log(`ℹ️ Marked recurring subscription cancelled: ${subId}`);
        break;
      }

      default:
        console.log(`Unhandled Stripe event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (dbError: any) {
    console.error('Database error in Stripe webhook:', dbError);
    return NextResponse.json({ error: 'Database recording failed' }, { status: 500 });
  }
}

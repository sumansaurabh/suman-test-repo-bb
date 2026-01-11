import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { updateUserBalance } from '@/lib/mock-db';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('Stripe-Signature') as string;

  let event;

  try {
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
       // In a real scenario, we might log this as a critical configuration error
       console.error('STRIPE_WEBHOOK_SECRET is not set');
       return NextResponse.json({ error: 'Configuration Error' }, { status: 500 });
    }
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error(`Webhook signature verification failed: ${errorMessage}`);
    return NextResponse.json({ error: `Webhook Error: ${errorMessage}` }, { status: 400 });
  }

  // Handle the event
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const amount = paymentIntent.amount; // Amount is in cents
    const userId = paymentIntent.metadata.userId;

    if (userId) {
        console.log(`Processing top-up for user ${userId}: +$${amount / 100}`);
        // Store in dollars
        await updateUserBalance(userId, amount / 100);
    } else {
        console.warn('PaymentIntent succeeded but no userId found in metadata.');
    }
  }

  return NextResponse.json({ received: true });
}

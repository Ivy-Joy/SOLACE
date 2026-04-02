import type { Request, Response } from 'express';
import Stripe from 'stripe';

// Initialize Stripe with the version currently expected by your library
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  // @ts-ignore - This suppresses the version mismatch if you want to stay on this version
  // Or better: remove the line entirely to use the library's default
  apiVersion: '2025-01-27.acacia', 
});

export async function createPaymentIntent(req: Request, res: Response) {
  try {
    const { amount, currency = 'usd', details } = req.body;

    if (!amount || amount < 50) {
      return res.status(400).json({ message: 'Amount too small or missing.' });
    }
    
    // Type-safe checking for details
    if (!details?.email || !details?.name) {
      return res.status(400).json({ message: 'Missing donor details.' });
    }

    const customer = await stripe.customers.create({
      email: details.email,
      name: details.name,
    });

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      customer: customer.id,
      automatic_payment_methods: { enabled: true },
      metadata: {
        donor_name: details.name,
        purpose: 'Mission Donation',
      },
    });

    return res.status(201).json({ clientSecret: paymentIntent.client_secret });

  } catch (err: unknown) {
    // Correctly typing 'err' as unknown and checking it
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('createPaymentIntent error:', errorMessage);
    return res.status(500).json({ message: 'Server error', error: errorMessage });
  }
}
import Stripe from "stripe";

export const isStripeConfigured = !!process.env.STRIPE_SECRET_KEY;

export const stripe = isStripeConfigured
  ? new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" })
  : null;

export const PLANS = {
  free: {
    id: "free",
    name: "Free",
    price_monthly: 0,
    price_annual: 0,
    stripe_monthly_id: null,
    stripe_annual_id: null,
  },
  pro: {
    id: "pro",
    name: "Pro",
    price_monthly: 12,
    price_annual: 99,
    stripe_monthly_id: process.env.STRIPE_PRO_MONTHLY_PRICE_ID,
    stripe_annual_id: process.env.STRIPE_PRO_ANNUAL_PRICE_ID,
  },
  business: {
    id: "business",
    name: "Business",
    price_monthly: 49,
    price_annual: 399,
    stripe_monthly_id: process.env.STRIPE_BUSINESS_MONTHLY_PRICE_ID,
    stripe_annual_id: process.env.STRIPE_BUSINESS_ANNUAL_PRICE_ID,
  },
} as const;

export async function createCheckoutSession({
  priceId,
  userId,
  email,
  successUrl,
  cancelUrl,
}: {
  priceId: string;
  userId: string;
  email: string;
  successUrl: string;
  cancelUrl: string;
}) {
  if (!stripe) throw new Error("Stripe is not configured — set STRIPE_SECRET_KEY");
  return stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    mode: "subscription",
    success_url: successUrl,
    cancel_url: cancelUrl,
    client_reference_id: userId,
    customer_email: email,
    metadata: { user_id: userId },
  });
}

export async function createBillingPortalSession({
  customerId,
  returnUrl,
}: {
  customerId: string;
  returnUrl: string;
}) {
  if (!stripe) throw new Error("Stripe is not configured — set STRIPE_SECRET_KEY");
  return stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });
}

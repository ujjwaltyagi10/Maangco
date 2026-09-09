import { AUTH_API_BASE_URL } from "./auth-api";

export class SubscriptionAuthError extends Error {
  constructor(message?: string) {
    super(message ?? "Your session has expired. Please sign in again to continue.");
    this.name = "SubscriptionAuthError";
  }
}

export type PlanType = "monthly" | "yearly";

export interface SubscriptionDiscount {
  source: "grant" | "coupon" | "campaign";
  discountType: "percent" | "flat";
  discountValue: number;
  couponCode?: string;
}

export interface SubscriptionData {
  subscriptionId: string;
  keyId: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  discount?: SubscriptionDiscount | null;
}

export async function createSubscription(
  token: string,
  plan: PlanType,
  couponCode?: string,
): Promise<SubscriptionData> {
  const response = await fetch(
    new URL("/subscription/create", AUTH_API_BASE_URL).toString(),
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ plan, billing: plan, couponCode: couponCode || undefined }),
    },
  );

  if (!response.ok) {
    if (response.status === 401) {
      let backendMsg: string | undefined;
      try {
        const data = (await response.json()) as Record<string, unknown>;
        backendMsg = typeof data.message === "string" ? data.message
          : typeof data.error === "string" ? data.error
          : undefined;
      } catch { /* ignore */ }
      throw new SubscriptionAuthError(backendMsg);
    }
    let message = "Unable to create subscription.";
    try {
      const data = (await response.json()) as Record<string, unknown>;
      if (typeof data.message === "string") message = data.message;
      else if (typeof data.error === "string") message = data.error;
    } catch {
      // ignore parse error, use fallback message
    }
    throw new Error(message);
  }

  return response.json() as Promise<SubscriptionData>;
}

export interface VerifyPayload {
  razorpay_payment_id: string;
  razorpay_subscription_id: string;
  razorpay_signature: string;
}

export async function verifySubscription(
  token: string,
  payload: VerifyPayload,
): Promise<void> {
  const response = await fetch(
    new URL("/subscription/verify", AUTH_API_BASE_URL).toString(),
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    if (response.status === 401) throw new SubscriptionAuthError();
    let message = "Payment verification failed.";
    try {
      const data = (await response.json()) as Record<string, unknown>;
      if (typeof data.error === "string") message = data.error;
      else if (typeof data.message === "string") message = data.message;
    } catch { /* ignore */ }
    throw new Error(message);
  }
}

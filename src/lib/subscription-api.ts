import { AUTH_API_BASE_URL } from "./auth-api";

export type PlanType = "monthly" | "yearly";

export interface SubscriptionData {
  subscriptionId: string;
  keyId: string;
  prefill: {
    email: string;
    contact: string;
  };
}

export async function createSubscription(
  token: string,
  plan: PlanType,
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
      body: JSON.stringify({ plan, billing: plan }),
    },
  );

  if (!response.ok) {
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

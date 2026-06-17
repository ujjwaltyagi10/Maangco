import { AUTH_API_BASE_URL } from "./auth-api";

export interface Plan {
  id: string;
  label: string;
  price: number;
  priceDisplay: string;
  period: string;
  billing: string;
  savingsLabel?: string;
  isPopular: boolean;
}

let _cache: Plan[] | null = null;

export async function fetchPlans(): Promise<Plan[]> {
  if (_cache) return _cache;
  const res = await fetch(`${AUTH_API_BASE_URL}/api/plans`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error("Failed to load plans");
  const data = (await res.json()) as { success: boolean; plans: Plan[] };
  _cache = data.plans;
  return _cache;
}

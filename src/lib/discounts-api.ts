import { AUTH_API_BASE_URL } from "./auth-api";
import type { PlanType } from "./subscription-api";

export interface CouponPreview {
  code: string;
  discountType: "percent" | "flat";
  discountValue: number;
  basePrice: number;
  discountedPrice: number;
}

export class CouponInvalidError extends Error {}

export async function validateCoupon(token: string, code: string, plan: PlanType): Promise<CouponPreview> {
  const res = await fetch(new URL("/api/coupons/validate", AUTH_API_BASE_URL).toString(), {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ code, plan }),
  });

  const data = (await res.json().catch(() => ({}))) as { success?: boolean; data?: CouponPreview; message?: string };
  if (!res.ok || !data.data) {
    throw new CouponInvalidError(data.message || "That code isn't valid right now");
  }
  return data.data;
}

export interface ActiveCampaign {
  name: string;
  discountType: "percent" | "flat";
  discountValue: number;
  appliesTo: "monthly" | "yearly" | "both";
  endsAt: string;
}

export async function fetchActiveCampaign(): Promise<ActiveCampaign | null> {
  const res = await fetch(new URL("/api/campaigns/active", AUTH_API_BASE_URL).toString(), {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { success: boolean; data: ActiveCampaign | null };
  return data.data;
}

export function computeDiscountedPrice(basePrice: number, discountType: "percent" | "flat", discountValue: number): number {
  const off = discountType === "percent" ? Math.round((basePrice * discountValue) / 100) : Math.min(discountValue, basePrice);
  return Math.max(basePrice - off, 0);
}

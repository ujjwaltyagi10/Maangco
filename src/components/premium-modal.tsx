import { useEffect, useState } from "react";
import { createSubscription, type PlanType } from "../lib/subscription-api";

interface PremiumModalProps {
  open: boolean;
  onClose: () => void;
  authToken: string | undefined;
  userEmail: string | undefined;
  onPaymentSuccess: () => void;
}

const ALL_COMPANIES = [
  "Google", "Meta", "Amazon", "Apple", "Netflix", "Microsoft",
  "Adobe", "Uber", "Flipkart", "Walmart", "Atlassian", "Bloomberg",
  "TikTok", "Nvidia", "Salesforce", "Goldman Sachs", "Citadel",
  "Snowflake", "TCS", "Airbnb", "Pinterest", "Oracle", "Visa",
];

const PLANS: Record<PlanType, { label: string; price: string; period: string; billing: string; badge?: string }> = {
  monthly: {
    label: "Monthly",
    price: "₹499",
    period: "/month",
    billing: "Billed every month",
  },
  yearly: {
    label: "Yearly",
    price: "₹2,999",
    period: "/year",
    billing: "Save ~50% · Billed once a year",
    badge: "Best Value",
  },
};

export function PremiumModal({ open, onClose, authToken, userEmail, onPaymentSuccess }: PremiumModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<PlanType>("monthly");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setIsProcessing(false);
      setError(null);
    }
  }, [open]);

  const handlePurchase = async () => {
    if (isProcessing) return;

    if (!authToken) {
      setError("Please sign in to continue.");
      return;
    }

    if (!window.Razorpay) {
      setError("Payment SDK not loaded. Please refresh and try again.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const data = await createSubscription(authToken, selectedPlan);

      const rzp = new window.Razorpay({
        key: data.keyId,
        subscription_id: data.subscriptionId,
        name: "PrepDoc",
        description: `${PLANS[selectedPlan].label} Premium`,
        prefill: {
          email: data.prefill.email || userEmail || "",
          contact: data.prefill.contact || "",
        },
        theme: { color: "#7c3aed" },
        handler: () => {
          onPaymentSuccess();
          onClose();
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
          },
        },
      });

      rzp.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed. Please try again.");
      setIsProcessing(false);
    }
  };

  if (!open) return null;

  const plan = PLANS[selectedPlan];
  const marqueeItems = [...ALL_COMPANIES, ...ALL_COMPANIES];

  return (
    <div className="premium-modal-overlay" onClick={onClose}>
      <div className="premium-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="premium-modal-close" onClick={onClose} aria-label="Close">
          ✕
        </button>

        {/* Gradient header — fixed, not scrollable */}
        <div className="premium-modal-header">
          <div className="pmh-orb pmh-orb--1" />
          <div className="pmh-orb pmh-orb--2" />
          <div className="pmh-orb pmh-orb--3" />
          <div className="pmh-content">
            <div className="pmh-icon">⭐</div>
            <div className="pmh-label">Premium Access</div>
          </div>

          {/* Infinite marquee of all companies */}
          <div className="pmh-marquee">
            <div className="pmh-marquee-track">
              {marqueeItems.map((name, i) => (
                <div key={i} className="pmh-chip">{name}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="premium-modal-scroll">
          <div className="premium-modal-body">
            <h2 className="premium-modal-title">Upgrade to Premium</h2>
            <p className="premium-modal-sub">
              Unlock company-wise question sheets and topic tags across all companies — curated from real interview reports.
            </p>

            {/* Plan toggle */}
            <div className="plan-toggle">
              {(["monthly", "yearly"] as PlanType[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  className={`plan-toggle-btn${selectedPlan === p ? " plan-toggle-btn--active" : ""}`}
                  onClick={() => setSelectedPlan(p)}
                >
                  {PLANS[p].label}
                  {PLANS[p].badge && (
                    <span className="plan-toggle-badge">{PLANS[p].badge}</span>
                  )}
                </button>
              ))}
            </div>

            <ul className="premium-modal-features">
              <li>
                <span className="pmf-check">✓</span>
                <span><strong>All Company Sheets</strong> — company-wise question sets sorted by interview frequency</span>
              </li>
              <li>
                <span className="pmf-check">✓</span>
                <span><strong>FAANG Sheets</strong> — Google, Meta, Amazon, Apple &amp; Netflix individually</span>
              </li>
              <li>
                <span className="pmf-check">✓</span>
                <span><strong>Question Tags</strong> — topic labels for every problem across all companies</span>
              </li>
              <li>
                <span className="pmf-check">✓</span>
                <span><strong>Frequency Data</strong> — know exactly how often each problem appears in real interviews</span>
              </li>
            </ul>

            <div className="premium-checkout">
              <div className="premium-checkout-label">Order Summary</div>
              <div className="premium-checkout-row">
                <span>Plan</span>
                <strong>{plan.label} Premium</strong>
              </div>
              <div className="premium-checkout-row">
                <span>Amount</span>
                <strong>
                  {plan.price}
                  <span className="premium-checkout-period">{plan.period}</span>
                </strong>
              </div>
              <div className="premium-checkout-row">
                <span>Billing</span>
                <strong>{plan.billing}</strong>
              </div>
              <div className="premium-checkout-row">
                <span>Payment methods</span>
                <strong>UPI, Cards, Wallets</strong>
              </div>
            </div>

            {error && <div className="premium-modal-error">{error}</div>}
          </div>
        </div>

        {/* Sticky footer — always visible */}
        <div className="premium-modal-footer">
          <button
            type="button"
            className="premium-modal-cta"
            onClick={handlePurchase}
            disabled={isProcessing}
          >
            {isProcessing
              ? "Opening Razorpay…"
              : `Pay ${plan.price} with Razorpay`}
            {!isProcessing && (
              <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12">
                <path d="M2 6h8M6 2l4 4-4 4" />
              </svg>
            )}
          </button>
          <button type="button" className="premium-modal-dismiss" onClick={onClose}>
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}

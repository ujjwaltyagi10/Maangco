import { useEffect, useState } from "react";
import { createSubscription, SubscriptionAuthError, type PlanType } from "../lib/subscription-api";

interface PremiumModalProps {
  open: boolean;
  onClose: () => void;
  authToken: string | undefined;
  userEmail: string | undefined;
  onPaymentSuccess: () => void;
  onSignInRequired?: () => void;
  defaultPlan?: PlanType;
}

const ALL_COMPANIES = [
  "Google", "Meta", "Amazon", "Apple", "Netflix", "Microsoft",
  "Adobe", "Uber", "Flipkart", "Walmart", "Atlassian", "Bloomberg",
  "TikTok", "Nvidia", "Salesforce", "Goldman Sachs", "Citadel",
  "Snowflake", "TCS", "Airbnb", "Pinterest", "Oracle", "Visa",
];

const PLANS: Record<PlanType, { label: string; price: string; period: string; billing: string }> = {
  monthly: {
    label: "Monthly",
    price: "₹299",
    period: "/mo",
    billing: "Billed every month",
  },
  yearly: {
    label: "Yearly",
    price: "₹1,999",
    period: "/yr",
    billing: "~₹167/mo · Billed once a year",
  },
};

const CHECK_ICON = (
  <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 6l3 3 5-5" />
  </svg>
);

export function PremiumModal({ open, onClose, authToken, userEmail, onPaymentSuccess, onSignInRequired, defaultPlan }: PremiumModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<PlanType>(defaultPlan ?? "monthly");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {
    if (open) {
      setSelectedPlan(defaultPlan ?? "monthly");
    } else {
      setIsProcessing(false);
      setError(null);
      setSessionExpired(false);
    }
  }, [open, defaultPlan]);

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
    setSessionExpired(false);

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
        theme: { color: "#4a7c41" },
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
      if (err instanceof SubscriptionAuthError) {
        setSessionExpired(true);
        setError("Your session has expired. Please sign in again to continue.");
      } else {
        setError(err instanceof Error ? err.message : "Payment failed. Please try again.");
      }
      setIsProcessing(false);
    }
  };

  if (!open) return null;

  const plan = PLANS[selectedPlan];
  const marqueeItems = [...ALL_COMPANIES, ...ALL_COMPANIES];

  return (
    <div className="premium-modal-overlay" onClick={onClose}>
      <div className="premium-modal" onClick={(e) => e.stopPropagation()}>

        {/* Close */}
        <button type="button" className="premium-modal-close" onClick={onClose} aria-label="Close">
          <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12">
            <path d="M1 1l10 10M11 1L1 11" />
          </svg>
        </button>

        {/* ── LEFT — Feature showcase ── */}
        <div className="pm-left">
          <div className="pm-left-orb pm-left-orb--1" />
          <div className="pm-left-orb pm-left-orb--2" />

          <div className="pm-left-badge">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#d4a04a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 20h20M4 20l2-8 6 4 6-4 2 8" />
              <circle cx="4" cy="10" r="1.5" fill="#d4a04a" stroke="none" />
              <circle cx="20" cy="10" r="1.5" fill="#d4a04a" stroke="none" />
              <circle cx="12" cy="6" r="1.5" fill="#d4a04a" stroke="none" />
            </svg>
            <span>PrepDoc Premium</span>
          </div>

          <div className="pm-left-heading">
            <h2 className="pm-left-title">
              Unlock everything.<br />
              <span className="pm-left-accent">Crack any interview.</span>
            </h2>
            <p className="pm-left-sub">Everything you need for MAANG and top-tier tech interviews — in one place.</p>
          </div>

          <ul className="pm-feat-list">
            <li className="pm-feat-item">
              <div className="pm-feat-check">{CHECK_ICON}</div>
              <div className="pm-feat-info">
                <span className="pm-feat-name">840+ DSA Questions</span>
                <span className="pm-feat-desc">Company sheets with frequency &amp; topic tags</span>
              </div>
            </li>
            <li className="pm-feat-item">
              <div className="pm-feat-check">{CHECK_ICON}</div>
              <div className="pm-feat-info">
                <span className="pm-feat-name">25+ Company Sheets</span>
                <span className="pm-feat-desc">Google, Meta, Amazon, Apple, Netflix &amp; more</span>
              </div>
            </li>
            <li className="pm-feat-item">
              <div className="pm-feat-check">{CHECK_ICON}</div>
              <div className="pm-feat-info">
                <span className="pm-feat-name">System Design — 150 Qs</span>
                <span className="pm-feat-desc">Full HLD + LLD roadmap with depth tracking</span>
              </div>
            </li>
            <li className="pm-feat-item">
              <div className="pm-feat-check">{CHECK_ICON}</div>
              <div className="pm-feat-info">
                <span className="pm-feat-name">275 Interview Questions</span>
                <span className="pm-feat-desc">Frontend &amp; behavioral, fully curated</span>
              </div>
            </li>
            <li className="pm-feat-item">
              <div className="pm-feat-check">{CHECK_ICON}</div>
              <div className="pm-feat-info">
                <span className="pm-feat-name">Tags &amp; Frequency Data</span>
                <span className="pm-feat-desc">Real interview occurrence data per problem</span>
              </div>
            </li>
          </ul>

          {/* Company marquee */}
          <div className="pm-left-marquee">
            <div className="pmh-marquee">
              <div className="pmh-marquee-track">
                {marqueeItems.map((name, i) => (
                  <div key={i} className="pmh-chip">{name}</div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT — Plan + checkout ── */}
        <div className="pm-right">
          <div className="pm-right-head">
            <div className="pm-right-title">Choose your plan</div>
            <div className="pm-right-sub">Cancel anytime. No questions asked.</div>
          </div>

          {/* Plan cards */}
          <div className="pm-plans">
            {/* Monthly */}
            <button
              type="button"
              className={`pm-plan-card${selectedPlan === "monthly" ? " pm-plan-card--active" : ""}`}
              onClick={() => setSelectedPlan("monthly")}
            >
              <div className="pm-plan-row">
                <div className="pm-plan-info">
                  <div className="pm-plan-name">Monthly</div>
                  <div className="pm-plan-billing">Billed every month</div>
                </div>
                <div className="pm-plan-price-wrap">
                  <span className="pm-plan-price">₹299</span>
                  <span className="pm-plan-period">/mo</span>
                </div>
                <div className={`pm-plan-radio${selectedPlan === "monthly" ? " pm-plan-radio--on" : ""}`}>
                  {selectedPlan === "monthly" && CHECK_ICON}
                </div>
              </div>
            </button>

            {/* Yearly */}
            <button
              type="button"
              className={`pm-plan-card pm-plan-card--featured${selectedPlan === "yearly" ? " pm-plan-card--active" : ""}`}
              onClick={() => setSelectedPlan("yearly")}
            >
              <div className="pm-plan-best-badge">Best Value · Save 44%</div>
              <div className="pm-plan-row">
                <div className="pm-plan-info">
                  <div className="pm-plan-name">Yearly</div>
                  <div className="pm-plan-billing">~₹167/mo · Billed once a year</div>
                </div>
                <div className="pm-plan-price-wrap">
                  <span className="pm-plan-price">₹1,999</span>
                  <span className="pm-plan-period">/yr</span>
                </div>
                <div className={`pm-plan-radio${selectedPlan === "yearly" ? " pm-plan-radio--on" : ""}`}>
                  {selectedPlan === "yearly" && CHECK_ICON}
                </div>
              </div>
            </button>
          </div>

          {/* Order summary */}
          <div className="pm-summary">
            <div className="pm-summary-label">Order summary</div>
            <div className="pm-summary-row">
              <span>Plan</span>
              <strong>{plan.label} Premium</strong>
            </div>
            <div className="pm-summary-row">
              <span>Amount</span>
              <strong>{plan.price}<span className="pm-summary-period">{plan.period}</span></strong>
            </div>
            <div className="pm-summary-row">
              <span>Billing</span>
              <strong>{plan.billing}</strong>
            </div>
            <div className="pm-summary-row">
              <span>Payment</span>
              <strong>UPI, Cards, Wallets</strong>
            </div>
          </div>

          {error && (
            <div className="premium-modal-error">
              <div className="pm-error-msg">{error}</div>
              {sessionExpired && onSignInRequired && (
                <button
                  type="button"
                  className="pm-error-signin-btn"
                  onClick={() => { onClose(); onSignInRequired(); }}
                >
                  Sign in again →
                </button>
              )}
            </div>
          )}

          {/* CTA */}
          <button
            type="button"
            className="premium-modal-cta"
            onClick={handlePurchase}
            disabled={isProcessing}
          >
            {isProcessing ? "Opening Razorpay…" : "Pay Now"}
            {!isProcessing && (
              <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12">
                <path d="M2 6h8M6 2l4 4-4 4" />
              </svg>
            )}
          </button>

          <div className="premium-modal-trust">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Secured by Razorpay · Cancel anytime · Instant access
          </div>

          <button type="button" className="premium-modal-dismiss" onClick={onClose}>
            Maybe later
          </button>
        </div>

      </div>
    </div>
  );
}

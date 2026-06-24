import { useEffect, useState } from "react";
import { createSubscription, verifySubscription, SubscriptionAuthError, type PlanType } from "../lib/subscription-api";
import { fetchPlans, type Plan } from "../lib/plans-api";
import { COMPANY_LOGOS } from "../lib/company-logos";

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
  "Adobe", "Uber", "Flipkart", "Walmart",
  "Salesforce", "Goldman Sachs",
  "Nvidia", "Atlassian", "Snowflake", "Airbnb",
  "Pinterest", "Oracle", "Visa",
];

const FALLBACK_PLANS: Plan[] = [
  { id: "monthly", label: "Monthly", price: 299, priceDisplay: "₹299", period: "/mo", billing: "Billed every month", isPopular: false },
  { id: "yearly", label: "Yearly", price: 1999, priceDisplay: "₹1,999", period: "/yr", billing: "~₹167/mo · Billed once a year", savingsLabel: "Save 44%", isPopular: true },
];

const CHECK_ICON = (
  <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 6l3 3 5-5" />
  </svg>
);

export function PremiumModal({ open, onClose, authToken, userEmail, onPaymentSuccess, onSignInRequired, defaultPlan }: PremiumModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<PlanType>(
    defaultPlan === "monthly" || defaultPlan === "yearly" ? defaultPlan : "monthly"
  );
  const [plans, setPlans] = useState<Plan[]>(FALLBACK_PLANS);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {
    fetchPlans().then(setPlans).catch(() => {});
  }, []);

  useEffect(() => {
    if (open) {
      setSelectedPlan(defaultPlan === "monthly" || defaultPlan === "yearly" ? defaultPlan : "monthly");
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
        name: "MAANGco",
        description: `${plans.find((p) => p.id === selectedPlan)?.label ?? selectedPlan} Premium`,
        prefill: {
          email: data.prefill.email || userEmail || "",
          contact: data.prefill.contact || "",
        },
        theme: { color: "#4a7c41" },
        handler: (response: {
          razorpay_payment_id: string;
          razorpay_subscription_id?: string;
          razorpay_signature: string;
        }) => {
          verifySubscription(authToken!, {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_subscription_id: response.razorpay_subscription_id ?? "",
            razorpay_signature: response.razorpay_signature,
          })
            .then(() => {
              onPaymentSuccess();
              onClose();
            })
            .catch((err: Error) => {
              setError(err instanceof SubscriptionAuthError
                ? "Session expired. Please sign in again."
                : (err.message || "Payment verification failed. Please contact support."));
              setIsProcessing(false);
            });
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

  const plan = plans.find((p) => p.id === selectedPlan) ?? FALLBACK_PLANS.find((p) => p.id === selectedPlan)!;
  const marqueeItems = [...ALL_COMPANIES, ...ALL_COMPANIES].map((name) => ({
    name,
    logo: COMPANY_LOGOS[name],
  }));
  const mobileItems = ALL_COMPANIES.map((name) => ({
    name,
    logo: COMPANY_LOGOS[name],
  }));

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
          <div className="pm-left-heading">
            <h2 className="pm-left-title">
              Unlock everything.<br />
              <span className="pm-left-accent">Crack any interview.</span>
            </h2>
            <p className="pm-left-sub">Everything you need for MAANG and top-tier tech interviews in one place.</p>
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
            <div className="pmh-marquee" aria-hidden="true">
              <div className="pmh-marquee-track">
                {marqueeItems.map((item, i) => (
                  <div key={`${item.name}-${i}`} className="pmh-chip pmh-chip--logo" title={item.name}>
                    <img src={item.logo} alt="" className="pmh-chip-logo" />
                  </div>
                ))}
              </div>
            </div>
            <div className="pm-mobile-company-grid" aria-hidden="true">
              {mobileItems.map((item) => (
                <div key={item.name} className="pmh-chip pmh-chip--logo pmh-chip--mobile" title={item.name}>
                  <img src={item.logo} alt="" className="pmh-chip-logo" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT — Plan + checkout ── */}
        <div className="pm-right">
          <div className="pm-right-head">
            <div className="pm-right-title">Choose your plan</div>
          </div>

          {/* Plan cards */}
          <div className="pm-plans">
            {plans.map((p) => (
              <button
                key={p.id}
                type="button"
                className={`pm-plan-card${p.isPopular ? " pm-plan-card--featured" : ""}${selectedPlan === p.id ? " pm-plan-card--active" : ""}`}
                onClick={() => setSelectedPlan(p.id as PlanType)}
              >
                <div className="pm-plan-row">
                  <div className="pm-plan-info">
                    <div className="pm-plan-name">{p.label}</div>
                    <div className="pm-plan-billing">{p.billing}</div>
                  </div>
                  <div className="pm-plan-price-wrap">
                    <span className="pm-plan-price">{p.priceDisplay}</span>
                    <span className="pm-plan-period">{p.period}</span>
                  </div>
                  <div className={`pm-plan-radio${selectedPlan === p.id ? " pm-plan-radio--on" : ""}`}>
                    {selectedPlan === p.id && CHECK_ICON}
                  </div>
                </div>
              </button>
            ))}
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
              <strong>{plan.priceDisplay}<span className="pm-summary-period">{plan.period}</span></strong>
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

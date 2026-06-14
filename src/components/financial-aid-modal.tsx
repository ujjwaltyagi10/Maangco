import { useState } from "react";

interface FinancialAidModalProps {
  open: boolean;
  onClose: () => void;
}

type Situation = "student" | "graduate" | "unemployed" | "freelancer" | "career-switch" | "other";
type Income = "below-10k" | "10-25k" | "25-50k" | "prefer-not";

interface FormData {
  name: string;
  email: string;
  situation: Situation | "";
  income: Income | "";
  story: string;
  role: string;
}

const SITUATIONS: { value: Situation; label: string }[] = [
  { value: "student", label: "Student" },
  { value: "graduate", label: "Recent Graduate" },
  { value: "unemployed", label: "Unemployed" },
  { value: "freelancer", label: "Freelancer / Gig Worker" },
  { value: "career-switch", label: "Career Switcher" },
  { value: "other", label: "Other" },
];

const INCOMES: { value: Income; label: string; sub: string }[] = [
  { value: "below-10k", label: "Below ₹10,000", sub: "per month" },
  { value: "10-25k", label: "₹10,000 – ₹25,000", sub: "per month" },
  { value: "25-50k", label: "₹25,000 – ₹50,000", sub: "per month" },
  { value: "prefer-not", label: "Prefer not to say", sub: "" },
];

const TOTAL_STEPS = 3;

export function FinancialAidModal({ open, onClose }: FinancialAidModalProps) {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<"fwd" | "back">("fwd");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    situation: "",
    income: "",
    story: "",
    role: "",
  });

  if (!open) return null;

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep(1);
      setDirection("fwd");
      setSubmitted(false);
      setErrors({});
      setFormData({ name: "", email: "", situation: "", income: "", story: "", role: "" });
    }, 300);
  };

  const set = (field: keyof FormData, value: string) => {
    setFormData((p) => ({ ...p, [field]: value }));
    setErrors((p) => ({ ...p, [field]: undefined }));
  };

  const validateStep = (): boolean => {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (step === 1) {
      if (!formData.name.trim()) e.name = "Name is required.";
      if (!formData.email.trim()) e.email = "Email is required.";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = "Enter a valid email.";
    }
    if (step === 2) {
      if (!formData.situation) e.situation = "Please select your situation.";
      if (!formData.income) e.income = "Please select an income range.";
    }
    if (step === 3) {
      if (formData.story.trim().length < 30) e.story = "Please write at least 30 characters.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const goNext = () => {
    if (!validateStep()) return;
    setDirection("fwd");
    setStep((s) => s + 1);
  };

  const goBack = () => {
    setDirection("back");
    setStep((s) => s - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    setIsSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="fa-overlay" onClick={handleClose}>
      <div className="fa-modal" onClick={(e) => e.stopPropagation()}>

        {/* Close */}
        <button type="button" className="fa-close" onClick={handleClose} aria-label="Close">
          <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12">
            <path d="M1 1l10 10M11 1L1 11" />
          </svg>
        </button>

        {!submitted ? (
          <>
            {/* Header */}
            <div className="fa-header">
              <div className="fa-header-badge">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#d4a04a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
                </svg>
                Financial Aid Programme
              </div>
              <h2 className="fa-title">Apply for free access</h2>
              <p className="fa-sub">We believe financial barriers shouldn't block your dream job. Every application is reviewed personally.</p>

              {/* Step progress */}
              <div className="fa-progress">
                {Array.from({ length: TOTAL_STEPS }, (_, i) => (
                  <div
                    key={i}
                    className={`fa-progress-dot${i + 1 === step ? " fa-progress-dot--active" : ""}${i + 1 < step ? " fa-progress-dot--done" : ""}`}
                  >
                    {i + 1 < step ? (
                      <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 6l3 3 5-5" />
                      </svg>
                    ) : (
                      <span>{i + 1}</span>
                    )}
                  </div>
                ))}
                <div className="fa-progress-bar">
                  <div className="fa-progress-fill" style={{ width: `${((step - 1) / (TOTAL_STEPS - 1)) * 100}%` }} />
                </div>
              </div>
            </div>

            {/* Step content */}
            <div key={`${step}-${direction}`} className={`fa-step fa-step--${direction}`}>
              {step === 1 && (
                <>
                  <div className="fa-step-title">Let's start with the basics</div>
                  <div className="fa-fields">
                    <div className="fa-field">
                      <label className="fa-label">Full name</label>
                      <input
                        className={`fa-input${errors.name ? " fa-input--error" : ""}`}
                        placeholder="e.g. Priya Sharma"
                        value={formData.name}
                        onChange={(e) => set("name", e.target.value)}
                        autoFocus
                      />
                      {errors.name && <div className="fa-field-error">{errors.name}</div>}
                    </div>
                    <div className="fa-field">
                      <label className="fa-label">Email address</label>
                      <input
                        type="email"
                        className={`fa-input${errors.email ? " fa-input--error" : ""}`}
                        placeholder="e.g. priya@email.com"
                        value={formData.email}
                        onChange={(e) => set("email", e.target.value)}
                      />
                      {errors.email && <div className="fa-field-error">{errors.email}</div>}
                    </div>
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="fa-step-title">Tell us your situation</div>
                  <div className="fa-fields">
                    <div className="fa-field">
                      <label className="fa-label">What best describes you?</label>
                      {errors.situation && <div className="fa-field-error">{errors.situation}</div>}
                      <div className="fa-pills">
                        {SITUATIONS.map((s) => (
                          <button
                            key={s.value}
                            type="button"
                            className={`fa-pill${formData.situation === s.value ? " fa-pill--active" : ""}`}
                            onClick={() => set("situation", s.value)}
                          >
                            {s.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="fa-field">
                      <label className="fa-label">Monthly household income</label>
                      {errors.income && <div className="fa-field-error">{errors.income}</div>}
                      <div className="fa-income-options">
                        {INCOMES.map((inc) => (
                          <button
                            key={inc.value}
                            type="button"
                            className={`fa-income-btn${formData.income === inc.value ? " fa-income-btn--active" : ""}`}
                            onClick={() => set("income", inc.value)}
                          >
                            <div className="fa-income-radio">
                              {formData.income === inc.value && <div className="fa-income-radio-dot" />}
                            </div>
                            <div>
                              <div className="fa-income-label">{inc.label}</div>
                              {inc.sub && <div className="fa-income-sub">{inc.sub}</div>}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <div className="fa-step-title">Your story</div>
                  <div className="fa-fields">
                    <div className="fa-field">
                      <label className="fa-label">
                        Why would MAANGco help you? <span className="fa-label-note">(min. 30 characters)</span>
                      </label>
                      <textarea
                        className={`fa-textarea${errors.story ? " fa-input--error" : ""}`}
                        placeholder="Tell us a bit about your situation — your goals, what you're working towards, and why access to MAANGco would make a difference..."
                        value={formData.story}
                        onChange={(e) => set("story", e.target.value)}
                        rows={4}
                        autoFocus
                      />
                      <div className="fa-char-count">{formData.story.length} characters</div>
                      {errors.story && <div className="fa-field-error">{errors.story}</div>}
                    </div>
                    <div className="fa-field">
                      <label className="fa-label">Target role <span className="fa-label-note">(optional)</span></label>
                      <input
                        className="fa-input"
                        placeholder="e.g. SDE at Google, Frontend Engineer at a startup..."
                        value={formData.role}
                        onChange={(e) => set("role", e.target.value)}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Footer navigation */}
            <div className="fa-footer">
              {step > 1 ? (
                <button type="button" className="fa-btn-back" onClick={goBack}>
                  ← Back
                </button>
              ) : (
                <div />
              )}
              {step < TOTAL_STEPS ? (
                <button type="button" className="fa-btn-next" onClick={goNext}>
                  Continue →
                </button>
              ) : (
                <button
                  type="button"
                  className="fa-btn-submit"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <><span className="fa-spinner" /> Submitting…</>
                  ) : (
                    "Submit Application →"
                  )}
                </button>
              )}
            </div>
          </>
        ) : (
          /* Success state */
          <div className="fa-success">
            <div className="fa-success-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h3 className="fa-success-title">Application Received!</h3>
            <p className="fa-success-sub">
              Thank you, <strong>{formData.name.split(" ")[0]}</strong>. We've received your application and will review it personally.
              You'll hear back at <strong>{formData.email}</strong> within 2–3 business days.
            </p>
            <div className="fa-success-note">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              If approved, you'll get 3 months of free Premium access — no card required.
            </div>
            <button type="button" className="fa-btn-next" onClick={handleClose}>
              Done
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

interface PremiumModalProps {
  open: boolean;
  onClose: () => void;
}

export function PremiumModal({ open, onClose }: PremiumModalProps) {
  if (!open) return null;

  return (
    <div className="premium-modal-overlay" onClick={onClose}>
      <div className="premium-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="premium-modal-close" onClick={onClose} aria-label="Close">
          ✕
        </button>

        {/* Gradient header card */}
        <div className="premium-modal-header">
          <div className="pmh-orb pmh-orb--1" />
          <div className="pmh-orb pmh-orb--2" />
          <div className="pmh-orb pmh-orb--3" />
          <div className="pmh-content">
            <div className="pmh-icon">⭐</div>
            <div className="pmh-label">Premium Access</div>
          </div>
          <div className="pmh-chips">
            {["Google", "Meta", "Amazon", "Apple", "Netflix", "Microsoft"].map((name) => (
              <div key={name} className="pmh-chip">{name}</div>
            ))}
          </div>
        </div>

        <div className="premium-modal-body">
          <h2 className="premium-modal-title">Upgrade to Premium</h2>
          <p className="premium-modal-sub">
            Unlock company-wise question sheets and topic tags across all companies — curated from real interview reports.
          </p>

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

          <div className="premium-modal-actions">
            <a
              href="mailto:support@prepdoc.app?subject=Premium%20Subscription"
              className="premium-modal-cta"
            >
              Get Premium Access
              <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12">
                <path d="M2 6h8M6 2l4 4-4 4" />
              </svg>
            </a>
            <button type="button" className="premium-modal-dismiss" onClick={onClose}>
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

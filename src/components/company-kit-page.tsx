import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Dispatch, SetStateAction } from "react";

import { DsaPanel } from "./dsa-panel";
import { CompanyLogo } from "./ui/company-logo";
import type { DsaCompany, QuestionId } from "@/types/maangco";
import { ROUTES } from "@/routes/route-paths";

interface CompanyKitPageProps {
  isPremium: boolean;
  onBuyPremium: () => void;
  companies: DsaCompany[];
  solvedIds: QuestionId[];
  bookmarkedIds: QuestionId[];
  onSolvedIdsChange: Dispatch<SetStateAction<QuestionId[]>>;
  onBookmarkedIdsChange: Dispatch<SetStateAction<QuestionId[]>>;
  isLoading?: boolean;
}

export function CompanyKitPage({
  isPremium,
  onBuyPremium,
  companies,
  solvedIds,
  bookmarkedIds,
  onSolvedIdsChange,
  onBookmarkedIdsChange,
  isLoading,
}: CompanyKitPageProps) {
  const { companyId } = useParams<{ companyId: string }>();
  const navigate = useNavigate();

  const company = useMemo(
    () => companies.find((c) => c.id === companyId),
    [companies, companyId],
  );

  const stats = useMemo(() => {
    if (!company) return null;
    const counts = { Easy: 0, Medium: 0, Hard: 0 };
    const solvedCounts = { Easy: 0, Medium: 0, Hard: 0 };
    let solved = 0;
    for (const q of company.questions) {
      counts[q.difficulty]++;
      if (solvedIds.includes(q.id)) {
        solved++;
        solvedCounts[q.difficulty]++;
      }
    }
    const total = company.questions.length;
    const pct = total > 0 ? Math.round((solved / total) * 100) : 0;
    return { total, solved, pct, counts, solvedCounts };
  }, [company, solvedIds]);

  // Same gauge-arc math as DsaPanel's .dsa-mini-ring, kept in sync so both
  // progress rings in the app look identical.
  const arcR = 22;
  const arcCirc = 2 * Math.PI * arcR;
  const arcLen = arcCirc * 0.75;
  const arcGap = arcCirc - arcLen;
  const arcFill = stats ? arcLen * (stats.solved / Math.max(1, stats.total)) : 0;

  if (!isLoading && !company) {
    return (
      <div className="ckp-not-found">
        <div className="ckp-not-found-title">Company not found</div>
        <p className="ckp-not-found-sub">
          We don&apos;t have a kit for this company yet.
        </p>
        <button type="button" className="ckp-back-btn" onClick={() => navigate(ROUTES.dsa)}>
          ← Browse all companies
        </button>
      </div>
    );
  }

  return (
    <div className="ckp-root">
      {company && (
        <div className="ckp-header" style={{ "--kit-accent": company.accent } as React.CSSProperties}>
          <div className="ckp-header-main">
            <div className="ckp-logo">
              <CompanyLogo name={company.name} src={company.logo} alt={company.name} />
            </div>
            <div className="ckp-header-text">
              <div className="ckp-eyebrow">Company kit</div>
              <h1 className="ckp-title">{company.name}</h1>
            </div>
          </div>
          {stats && (
            <div className="dsa-progress-card">
              <div className="dsa-mini-ring">
                <svg viewBox="0 0 56 56" className="dsa-mini-ring-svg">
                  <circle cx="28" cy="28" r={arcR} fill="none" stroke="var(--border2)" strokeWidth="3"
                    strokeDasharray={`${arcLen} ${arcGap}`} strokeLinecap="round"
                    transform="rotate(135, 28, 28)" />
                  <circle cx="28" cy="28" r={arcR} fill="none" stroke="var(--accent)" strokeWidth="3"
                    strokeDasharray={`${arcFill} ${arcCirc - arcFill}`} strokeLinecap="round"
                    transform="rotate(135, 28, 28)"
                    style={{ transition: "stroke-dasharray 0.5s ease" }} />
                </svg>
                <div className="dsa-mini-ring-label">{stats.pct}%</div>
              </div>
              <div className="dsa-progress-info">
                <span className="dsa-progress-count">
                  {stats.solved}<span className="dsa-progress-total">/{stats.total}</span>
                </span>
                <span className="dsa-progress-label">✓ Solved</span>
              </div>
              <div className="dsa-progress-sep" />
              <div className="dsa-diff-stats">
                <div className="dsa-diff-stat dsa-diff-stat--easy">
                  <span className="dsa-diff-stat-label">Easy</span>
                  <span className="dsa-diff-stat-val">{stats.solvedCounts.Easy}/{stats.counts.Easy}</span>
                </div>
                <div className="dsa-diff-stat dsa-diff-stat--medium">
                  <span className="dsa-diff-stat-label">Med.</span>
                  <span className="dsa-diff-stat-val">{stats.solvedCounts.Medium}/{stats.counts.Medium}</span>
                </div>
                <div className="dsa-diff-stat dsa-diff-stat--hard">
                  <span className="dsa-diff-stat-label">Hard</span>
                  <span className="dsa-diff-stat-val">{stats.solvedCounts.Hard}/{stats.counts.Hard}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="ckp-panel">
        <DsaPanel
          isPremium={isPremium}
          onBuyPremium={onBuyPremium}
          companies={companies}
          solvedIds={solvedIds}
          bookmarkedIds={bookmarkedIds}
          onSolvedIdsChange={onSolvedIdsChange}
          onBookmarkedIdsChange={onBookmarkedIdsChange}
          isLoading={isLoading}
          lockedCompanyId={companyId}
        />
      </div>
    </div>
  );
}

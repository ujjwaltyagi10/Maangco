import { useMemo, useState } from "react";
import type { DsaCompany } from "@/types/maangco";
import { CompanyLogo } from "./ui/company-logo";

interface CompanyKitsModalProps {
  open: boolean;
  onClose: () => void;
  companies: DsaCompany[];
  onSelectCompany: (companyId: string) => void;
}

export function CompanyKitsModal({ open, onClose, companies, onSelectCompany }: CompanyKitsModalProps) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return companies;
    return companies.filter((c) => c.name.toLowerCase().includes(q));
  }, [companies, search]);

  if (!open) return null;

  return (
    <div className="ckm-overlay" onClick={onClose}>
      <div className="ckm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ckm-head">
          <div className="ckm-head-title">
            <span className="ckm-head-icon">
              <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="7" width="14" height="11" rx="1.5" />
                <path d="M7 7V4.5A1.5 1.5 0 0 1 8.5 3h3A1.5 1.5 0 0 1 13 4.5V7" />
              </svg>
            </span>
            Choose a company kit
          </div>
          <button type="button" className="ckm-close" onClick={onClose} aria-label="Close">
            <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12">
              <path d="M1 1l10 10M11 1L1 11" />
            </svg>
          </button>
        </div>

        <div className="ckm-search-wrap">
          <svg className="ckm-search-icon" viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6">
            <circle cx="7" cy="7" r="5.2" />
            <path d="M13.5 13.5L11 11" strokeLinecap="round" />
          </svg>
          <input
            className="ckm-search"
            placeholder="Search companies"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoComplete="off"
            autoFocus
          />
        </div>

        <div className="ckm-grid">
          {filtered.map((c) => (
            <button
              key={c.id}
              type="button"
              className="ckm-item"
              style={{ "--kit-accent": c.accent } as React.CSSProperties}
              onClick={() => { onSelectCompany(c.id); onClose(); }}
            >
              <span className="ckm-item-logo">
                <CompanyLogo name={c.name} src={c.logo} />
              </span>
              <span className="ckm-item-name">{c.name}</span>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="ckm-empty">No companies match &ldquo;{search}&rdquo;.</div>
          )}
        </div>
      </div>
    </div>
  );
}

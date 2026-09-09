import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/routes/route-paths";
import { fetchCareerRoles, getCachedCareerRoles, type CareerRole } from "@/lib/careers-api";
import { CareerApplyModal } from "@/components/career-apply-modal";
import instagramSvg from "@/assets/svg/instagram.svg";
import linkedinSvg from "@/assets/svg/linkedin.svg";

interface CareerPageProps {
  theme: "light" | "dark";
  onThemeChange: () => void;
}

export function CareerPage({ theme, onThemeChange }: CareerPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [openRoleId, setOpenRoleId] = useState<string | null>(null);
  const [applyRoleId, setApplyRoleId] = useState<string | null>(null);
  const cachedRoles = getCachedCareerRoles();
  const [roles, setRoles] = useState<CareerRole[]>(cachedRoles ?? []);
  const [rolesLoading, setRolesLoading] = useState(cachedRoles === null);
  const [rolesError, setRolesError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onScroll = () => setNavScrolled(el.scrollTop > 20);
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    fetchCareerRoles()
      .then(setRoles)
      .catch(() => setRolesError(true))
      .finally(() => setRolesLoading(false));
  }, []);

  return (
    <div className="landing w-full min-w-0" ref={containerRef}>

      {/* ── NAVBAR ── */}
      <nav className={`landing-nav${navScrolled ? " scrolled" : ""}${mobileMenuOpen ? " mobile-open" : ""}`}>
        <div className="landing-container">
          <div className="landing-nav-row">
            <div className="landing-nav-left">
              <Link to={ROUTES.landing} className="landing-logo shrink-0">
                <div className="landing-logo-mark">
                  <svg viewBox="0 0 20 20" width="16" height="16">
                    <path d="M10 1L2 6v8l8 5 8-5V6L10 1zm0 2.3L16 7v6l-6 3.7L4 13V7l6-3.7z" fill="white" />
                  </svg>
                </div>
                <span className="landing-logo-text">MAANG<em>co</em></span>
              </Link>
            </div>
            <div className="hidden lg:flex items-center gap-2">
              <button type="button" className="lnav-theme-btn" onClick={onThemeChange} aria-label="Toggle theme">
                {theme === "light" ? (
                  <svg viewBox="0 0 20 20" fill="currentColor" width="15" height="15">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" width="15" height="15">
                    <circle cx="10" cy="10" r="3.2" />
                    <path d="M10 2V4M10 16V18M2 10H4M16 10H18M4.9 4.9L6.3 6.3M13.7 13.7L15.1 15.1M4.9 15.1L6.3 13.7M13.7 6.3L15.1 4.9" />
                  </svg>
                )}
              </button>
            </div>
            <div className="landing-nav-mobile">
              <button type="button" className="lnav-theme-btn" onClick={onThemeChange} aria-label="Toggle theme">
                {theme === "light" ? (
                  <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" width="14" height="14">
                    <circle cx="10" cy="10" r="3.2" />
                    <path d="M10 2V4M10 16V18M2 10H4M16 10H18" />
                  </svg>
                )}
              </button>
              <button type="button" className="lnav-theme-btn" onClick={() => setMobileMenuOpen((v) => !v)} aria-label="Toggle menu">
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16">
                  {mobileMenuOpen
                    ? <path d="M4 4l12 12M16 4L4 16" strokeLinecap="round" />
                    : <path d="M3 6h14M3 10h14M3 14h14" strokeLinecap="round" />}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── CAREER PORTAL ── */}
      <section className="lcareer-section">
        <div className="lcareer-inner">
          <div className="lcareer-left">
            <p className="lcareer-eyebrow">Careers</p>
            <h1 className="lcareer-heading">Career Portal</h1>
            <p className="lcareer-sub">
              We're a small, fast-moving team building the sharpest interview-prep
              platform out there. Come build it with us.
            </p>
            <div className="lcareer-contact">
              <span className="lcareer-contact-label">Or contact us with</span>
              <a href="mailto:careers@maangco.com" className="lcareer-contact-link">careers@maangco.com</a>
            </div>
          </div>

          <div className="lcareer-right">
            {rolesLoading ? (
              <p className="lcareer-role-desc">Loading open roles…</p>
            ) : rolesError ? (
              <p className="lcareer-role-desc">
                Couldn't load open roles right now — reach out at{" "}
                <a href="mailto:careers@maangco.com" className="lcareer-contact-link">careers@maangco.com</a> instead.
              </p>
            ) : roles.length === 0 ? (
              <p className="lcareer-role-desc">
                No open roles right now — but we're always happy to hear from good people. Email us at{" "}
                <a href="mailto:careers@maangco.com" className="lcareer-contact-link">careers@maangco.com</a>.
              </p>
            ) : (
              roles.map((role) => {
                const isOpen = openRoleId === role.id;
                return (
                  <div key={role.id} className={`lcareer-role${isOpen ? " open" : ""}`}>
                    <div className="lcareer-role-main">
                      <div className="lcareer-role-head">
                        <p className="lcareer-role-eyebrow">Open Role</p>
                        <h3 className="lcareer-role-title">{role.title}</h3>
                        <div className="lcareer-role-meta">
                          <span>{role.type}</span>
                          {role.experience && (
                            <>
                              <span className="lcareer-meta-dot" />
                              <span>{role.experience}</span>
                            </>
                          )}
                          <span className="lcareer-meta-dot" />
                          <span>{role.location}</span>
                        </div>
                      </div>
                      <div className="lcareer-role-actions">
                        <button
                          type="button"
                          className="lcareer-role-toggle"
                          onClick={() => setOpenRoleId(isOpen ? null : role.id)}
                          aria-label={isOpen ? "Collapse details" : "Expand details"}
                          aria-expanded={isOpen}
                        >
                          <svg
                            viewBox="0 0 12 12"
                            width="11"
                            height="11"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}
                          >
                            <path d="M2 4l4 4 4-4" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          className="lbtn-primary lcareer-apply-btn"
                          onClick={() => setApplyRoleId(role.id)}
                        >
                          Apply Now
                          <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" width="11" height="11">
                            <path d="M2 6h8M6 2l4 4-4 4" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    {isOpen && <p className="lcareer-role-desc">{role.description}</p>}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="lfooter">
        <div className="landing-container">
          <div className="lfooter-center">
            <div className="lfooter-logo-mark-wrap">
              <svg viewBox="0 0 20 20" width="26" height="26">
                <path d="M10 1L2 6v8l8 5 8-5V6L10 1zm0 2.3L16 7v6l-6 3.7L4 13V7l6-3.7z" fill="white" />
              </svg>
            </div>
            <div className="lfooter-links-row">
              <Link to={ROUTES.termsConditions} className="lfooter-link" style={{ textDecoration: "none" }}>Terms and Conditions</Link>
              <Link to={ROUTES.contact} className="lfooter-link" style={{ textDecoration: "none" }}>Contact us</Link>
              <Link to={ROUTES.financialAid} className="lfooter-link" style={{ textDecoration: "none" }}>Financial Aid</Link>
              <Link to={ROUTES.career} className="lfooter-link" style={{ textDecoration: "none" }}>Career</Link>
              <Link to={ROUTES.privacyPolicy} className="lfooter-link" style={{ textDecoration: "none" }}>Privacy Policy</Link>
              <Link to={ROUTES.cancellationPolicy} className="lfooter-link" style={{ textDecoration: "none" }}>Cancellation and Refund Policy</Link>
            </div>
            <div className="lfooter-social-row">
              <a href="https://x.com/MAANGcode" target="_blank" rel="noreferrer" className="lfooter-social-link" aria-label="X">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" className="lfooter-social-icon" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="https://www.instagram.com/maang_co/" target="_blank" rel="noreferrer" className="lfooter-social-link" aria-label="Instagram">
                <img src={instagramSvg} alt="" width="18" height="18" className="lfooter-social-icon" />
              </a>
              <a href="https://www.linkedin.com/company/maangco" target="_blank" rel="noreferrer" className="lfooter-social-link" aria-label="LinkedIn">
                <img src={linkedinSvg} alt="" width="18" height="18" className="lfooter-social-icon" />
              </a>
            </div>
            <div className="lfooter-divider" />
            <div className="lfooter-bottom">
              <p className="lfooter-wordmark">MAANG<em>co</em></p>
              <p className="lfooter-copy">© 2025 MAANGco. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>

      <CareerApplyModal
        open={!!applyRoleId}
        roleId={applyRoleId ?? ""}
        roleTitle={roles.find((r) => r.id === applyRoleId)?.title ?? ""}
        onClose={() => setApplyRoleId(null)}
      />

    </div>
  );
}

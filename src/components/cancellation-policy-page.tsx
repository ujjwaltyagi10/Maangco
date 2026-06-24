import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/routes/route-paths";

interface CancellationPolicyPageProps {
  theme: "light" | "dark";
  onThemeChange: () => void;
}

function Section({ id, num, title, children }: { id: string; num: string; title: string; children: ReactNode }) {
  return (
    <div id={id} className="ltc-card scroll-mt-28">
      <div className="ltc-card-num">{num}</div>
      <h2 className="ltc-card-title">{title}</h2>
      <div className="ltc-card-body">{children}</div>
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="ltc-list">
      {items.map((item) => (
        <li key={item} className="ltc-list-item">
          <span className="ltc-list-dot" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function TocLink({ id, label, active }: { id: string; label: string; active: boolean }) {
  return (
    <a href={`#${id}`} className={`ltc-toc-link${active ? " active" : ""}`}>
      {label}
    </a>
  );
}

const TOC = [
  { id: "overview",        label: "1. Overview" },
  { id: "no-refund",       label: "2. No-Refund Policy" },
  { id: "no-cancellation", label: "3. No-Cancellation Policy" },
  { id: "unused-time",     label: "4. Unused Subscription Time" },
  { id: "shutdown",        label: "5. Platform Shutdown" },
  { id: "liability",       label: "6. Limitation of Liability" },
  { id: "misuse",          label: "7. Account Misuse" },
  { id: "blacklist",       label: "8. Blacklisted Accounts" },
  { id: "chargebacks",     label: "9. Chargebacks" },
  { id: "legal",           label: "10. Legal Action" },
  { id: "contact",         label: "11. Contact Us" },
];

export function CancellationPolicyPage({ theme, onThemeChange }: CancellationPolicyPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [activeId, setActiveId] = useState<string>(TOC[0].id);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onScroll = () => setNavScrolled(el.scrollTop > 20);
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = TOC.map((t) => t.id);
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) setActiveId(visible[0].target.id);
      },
      { root: containerRef.current, rootMargin: "-30% 0px -60% 0px", threshold: 0 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observerRef.current!.observe(el);
    });
    return () => observerRef.current?.disconnect();
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
              <Link to={ROUTES.landing} className="lnav-sign-in" style={{ textDecoration: "none" }}>Sign In</Link>
              <Link to={ROUTES.landing} className="lnav-get-started" style={{ textDecoration: "none" }}>Back to home →</Link>
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

          {mobileMenuOpen && (
            <div className="lnav-mobile-drawer">
              {[
                { href: `${ROUTES.landing}#features`,     label: "Features" },
                { href: `${ROUTES.landing}#pricing`,      label: "Pricing" },
                { href: `${ROUTES.landing}#testimonials`, label: "Reviews" },
                { href: `${ROUTES.landing}#faq`,          label: "FAQ" },
              ].map(({ href, label }) => (
                <Link key={href} to={href} className="lnav-mobile-link" style={{ textDecoration: "none" }}
                  onClick={() => setMobileMenuOpen(false)}>{label}</Link>
              ))}
              <div className="lnav-mobile-actions">
                <Link to={ROUTES.landing} className="lnav-sign-in" style={{ flex: 1, textDecoration: "none" }}
                  onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
                <Link to={ROUTES.landing} className="lnav-get-started" style={{ flex: 1, textDecoration: "none" }}
                  onClick={() => setMobileMenuOpen(false)}>Back to home →</Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="ltc-hero">
        <div className="landing-container">
          <p className="ltc-eyebrow">Legal</p>
          <h1 className="ltc-h1">Cancellation & Refund Policy</h1>
          <p className="ltc-sub">
            Last updated: June 2025. Please read this policy carefully before making any purchase on the MAANGco platform.
          </p>
        </div>
      </section>

      {/* ── LAYOUT ── */}
      <div className="ltc-layout">
        <div className="landing-container" style={{ display: "flex", gap: "48px", alignItems: "flex-start" }}>

          {/* Sticky sidebar TOC */}
          <aside className="ltc-sidebar">
            <p className="ltc-sidebar-label">On this page</p>
            <nav className="ltc-toc">
              {TOC.map(({ id, label }) => (
                <TocLink key={id} id={id} label={label} active={activeId === id} />
              ))}
            </nav>
          </aside>

          {/* Sections */}
          <div className="ltc-content">

            <Section id="overview" num="01" title="Overview">
              <p>This Cancellation & Refund Policy ("Policy") governs all purchases made on the MAANGco platform ("Platform"). By completing a purchase, you acknowledge that you have read, understood, and agreed to this Policy in full. Please review it carefully before subscribing.</p>
            </Section>

            <Section id="no-refund" num="02" title="No-Refund Policy">
              <p>All payments made on the MAANGco platform are <strong>strictly non-refundable</strong> once a subscription or plan has been activated. This applies to:</p>
              <BulletList items={[
                "Monthly and annual subscription plans.",
                "One-time purchase plans or lifetime access offerings.",
                "Any partial or unused portion of a subscription period.",
                "Situations where the user voluntarily stops using the Platform.",
              ]} />
              <p style={{ marginTop: 12 }}>We encourage all users to review the free-tier features and any available trial content before making a purchase decision.</p>
            </Section>

            <Section id="no-cancellation" num="03" title="No-Cancellation Policy">
              <p>Once a subscription is activated and payment has been processed, the subscription <strong>cannot be cancelled</strong> mid-term for a refund. Specifically:</p>
              <BulletList items={[
                "Cancellation requests submitted after payment will not result in a refund for the current billing cycle.",
                "You may choose not to renew your subscription at the end of the current term by disabling auto-renewal from your account settings.",
                "Disabling auto-renewal will take effect at the next renewal date; no refund is issued for the remaining active period.",
              ]} />
            </Section>

            <Section id="unused-time" num="04" title="Unused Subscription Time">
              <p>Users who cease using the Platform during an active subscription period are not entitled to a refund or credit for unused time. Subscription access is granted for the full term regardless of actual usage.</p>
              <p style={{ marginTop: 12 }}>It is the subscriber's responsibility to actively manage their account and make use of the Platform during their paid period. MAANGco bears no liability for unused access.</p>
            </Section>

            <Section id="shutdown" num="05" title="Platform Shutdown">
              <p>In the unlikely event of an abrupt or permanent shutdown of the MAANGco platform, MAANGco will not be obligated to provide refunds for any fees already collected. We will make commercially reasonable efforts to provide advance notice of any such shutdown, but refunds cannot be guaranteed under such circumstances.</p>
            </Section>

            <Section id="liability" num="06" title="Limitation of Liability">
              <p>MAANGco shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising from:</p>
              <BulletList items={[
                "Your use of or inability to use the Platform.",
                "Temporary service interruptions, maintenance downtime, or technical failures.",
                "Discontinuation of any feature, plan, or the Platform itself.",
                "Loss of data, progress, or access due to account suspension or termination.",
              ]} />
              <p style={{ marginTop: 12 }}>This limitation applies equally to paying and free-tier subscribers to the maximum extent permitted by applicable law.</p>
            </Section>

            <Section id="misuse" num="07" title="Account Misuse">
              <p>MAANGco actively monitors account activity to protect the integrity of the Platform. The following behaviours may result in account flagging, restriction, or immediate suspension without refund:</p>
              <BulletList items={[
                "Simultaneous logins from multiple IP addresses or devices in a manner inconsistent with personal use.",
                "Sharing account credentials with other individuals.",
                "Redistributing, recording, or republishing Platform content (questions, videos, roadmaps, solutions) without authorisation.",
                "Using automated tools, bots, or scripts to access or scrape Platform content.",
                "Any activity that places an unusual or excessive load on Platform infrastructure.",
              ]} />
              <p style={{ marginTop: 12 }}>No refund will be issued if a subscription is suspended or terminated due to policy violations.</p>
            </Section>

            <Section id="blacklist" num="08" title="Blacklisted Accounts">
              <p>Users found in serious or repeated violation of MAANGco's policies may be permanently blacklisted. Consequences include:</p>
              <BulletList items={[
                "Immediate and permanent suspension of the account.",
                "Complete and irrevocable loss of access to all Platform content and features.",
                "Denial of future registration or access to the Platform under any email or identity.",
                "Forfeiture of any remaining subscription time without compensation.",
              ]} />
            </Section>

            <Section id="chargebacks" num="09" title="Chargebacks">
              <p>If you have a concern about a charge, please contact our support team at <a href="mailto:support@maangco.com" className="ltc-link">support@maangco.com</a> before initiating a chargeback with your bank or payment provider.</p>
              <BulletList items={[
                "Initiating an unsupported chargeback may trigger immediate account suspension.",
                "Fraudulent or unjustified chargebacks will result in permanent account revocation.",
                "MAANGco reserves the right to dispute any chargeback and provide evidence of the agreed terms to payment processors.",
              ]} />
            </Section>

            <Section id="legal" num="10" title="Legal Action">
              <p>MAANGco reserves the right to pursue all available legal remedies against users who engage in:</p>
              <BulletList items={[
                "Fraudulent payment activity or chargebacks.",
                "Unauthorised sharing, redistribution, or reproduction of Platform content.",
                "Systematic abuse of the Platform or its users.",
                "Any conduct that causes reputational or financial harm to MAANGco.",
              ]} />
              <p style={{ marginTop: 12 }}>Legal proceedings may be initiated under applicable Indian law, including the Information Technology Act, 2000 and the Indian Penal Code. All disputes are subject to the exclusive jurisdiction of the courts of Bengaluru, Karnataka, India.</p>
            </Section>

            <Section id="contact" num="11" title="Contact Us">
              <p>If you have questions about this Policy or wish to raise a billing concern before initiating any formal dispute, please reach out to us:</p>
              <BulletList items={[
                "Email: support@maangco.com",
                "We will acknowledge your query within 72 hours and endeavour to resolve it within 30 days.",
              ]} />
            </Section>

          </div>
        </div>
      </div>

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
              <a href="#" className="lfooter-link">Pricing</a>
              <Link to={ROUTES.privacyPolicy} className="lfooter-link" style={{ textDecoration: "none" }}>Privacy Policy</Link>
              <Link to={ROUTES.cancellationPolicy} className="lfooter-link" style={{ textDecoration: "none" }}>Cancellation and Refund Policy</Link>
            </div>
            <div className="lfooter-social-row">
              <a href="https://x.com/MAANGcode" target="_blank" rel="noreferrer" className="lfooter-social-link" aria-label="X">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://www.linkedin.com/company/maangco" target="_blank" rel="noreferrer" className="lfooter-social-link" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
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

    </div>
  );
}

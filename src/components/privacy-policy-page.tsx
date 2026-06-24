import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/routes/route-paths";

interface PrivacyPolicyPageProps {
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
  { id: "acceptance",       label: "1. Acceptance" },
  { id: "information",      label: "2. Information We Collect" },
  { id: "use",              label: "3. Use of Information" },
  { id: "sharing",          label: "4. Sharing of Information" },
  { id: "cookies",          label: "5. Cookies & Tracking" },
  { id: "security",         label: "6. Data Security" },
  { id: "retention",        label: "7. Data Retention" },
  { id: "user-rights",      label: "8. Your Rights" },
  { id: "responsibility",   label: "9. User Responsibility" },
  { id: "opt-out",          label: "10. Opt-Out" },
  { id: "third-party",      label: "11. Third-Party Links" },
  { id: "children",         label: "12. Children's Privacy" },
  { id: "changes",          label: "13. Changes to Policy" },
  { id: "governing-law",    label: "14. Governing Law" },
  { id: "contact",          label: "15. Contact Us" },
];

export function PrivacyPolicyPage({ theme, onThemeChange }: PrivacyPolicyPageProps) {
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
          <h1 className="ltc-h1">Privacy Policy</h1>
          <p className="ltc-sub">
            Last updated: June 2025. This policy explains how MAANGco collects, uses, and protects your personal information.
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

            <Section id="acceptance" num="01" title="Acceptance">
              <p>By accessing or using the MAANGco platform ("Platform"), you confirm that you have read, understood, and agree to be bound by this Privacy Policy. If you do not agree with any part of this policy, please discontinue use of the Platform immediately.</p>
            </Section>

            <Section id="information" num="02" title="Information We Collect">
              <p>We collect information you provide directly and information generated through your use of the Platform:</p>
              <BulletList items={[
                "Personal details: name, email address, and profile information provided at registration.",
                "Account data: learning activity, problem-solving history, progress metrics, and subscription tier.",
                "Payment information: billing details processed securely through our payment gateway partners — MAANGco does not store raw card data.",
                "Technical data: IP address, browser type, device identifiers, operating system, and referring URLs.",
                "Communication records: support tickets, feedback submissions, and email correspondence.",
                "Cookies and similar technologies: session tokens, preference cookies, and analytics identifiers.",
              ]} />
            </Section>

            <Section id="use" num="03" title="Use of Information">
              <p>We use the information we collect to:</p>
              <BulletList items={[
                "Provide, operate, and maintain the Platform and its features.",
                "Process transactions and manage your subscription.",
                "Personalise your learning experience and track progress.",
                "Send transactional emails (receipts, password resets, verification).",
                "Send service updates and, where you have opted in, promotional communications.",
                "Analyse usage patterns to improve platform performance and content quality.",
                "Detect, prevent, and respond to fraud, abuse, or security incidents.",
                "Comply with applicable legal obligations.",
              ]} />
            </Section>

            <Section id="sharing" num="04" title="Sharing of Information">
              <p>MAANGco does not sell your personal data. We may share information only in the following circumstances:</p>
              <BulletList items={[
                "Service providers: trusted third parties (payment gateways, email delivery, hosting, analytics) who process data on our behalf under strict confidentiality obligations.",
                "Legal requirements: when disclosure is required by law, court order, or governmental authority.",
                "Business transfers: in connection with a merger, acquisition, or sale of assets, subject to the acquirer honouring this policy.",
                "Aggregated or anonymised data: non-identifiable statistical information that cannot reasonably be linked to any individual.",
              ]} />
            </Section>

            <Section id="cookies" num="05" title="Cookies & Tracking">
              <p>We use cookies and similar tracking technologies to enhance your experience on the Platform:</p>
              <BulletList items={[
                "Essential cookies: required for authentication and core Platform functionality.",
                "Preference cookies: store your settings such as theme and language preferences.",
                "Analytics cookies: help us understand how users navigate the Platform so we can improve it.",
              ]} />
              <p style={{ marginTop: 12 }}>You can control or disable cookies through your browser settings. Disabling essential cookies may affect Platform functionality.</p>
            </Section>

            <Section id="security" num="06" title="Data Security">
              <p>We implement industry-standard technical and organisational measures to protect your personal data against unauthorised access, alteration, disclosure, or destruction. These include encrypted data transmission (HTTPS/TLS), hashed credential storage, and restricted internal access controls.</p>
              <p style={{ marginTop: 12 }}>However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.</p>
            </Section>

            <Section id="retention" num="07" title="Data Retention">
              <p>We retain your personal data only for as long as necessary to fulfil the purposes described in this policy or as required by applicable law. Specifically:</p>
              <BulletList items={[
                "Active account data is retained for the duration of your account.",
                "Payment records are retained for up to 7 years for accounting and tax compliance.",
                "Support and communication records are retained for up to 3 years.",
                "You may request deletion of your account and personal data by contacting us at support@maangco.com. We will action verified deletion requests within 30 days.",
              ]} />
            </Section>

            <Section id="user-rights" num="08" title="Your Rights">
              <p>Subject to applicable law, you have the following rights regarding your personal data:</p>
              <BulletList items={[
                "Access: request a copy of the personal data we hold about you.",
                "Correction: request correction of inaccurate or incomplete data.",
                "Deletion: request erasure of your personal data (subject to legal retention obligations).",
                "Portability: request your data in a structured, machine-readable format.",
                "Objection: object to processing of your data for direct marketing purposes.",
                "Withdrawal of consent: withdraw consent at any time where processing is based on consent.",
              ]} />
              <p style={{ marginTop: 12 }}>To exercise any of these rights, contact us at <a href="mailto:support@maangco.com" className="ltc-link">support@maangco.com</a>. We will respond within 30 days.</p>
            </Section>

            <Section id="responsibility" num="09" title="User Responsibility">
              <p>You are responsible for maintaining the confidentiality of your account credentials. Do not share your password with any third party. MAANGco will never ask for your password via email or support chat.</p>
              <p style={{ marginTop: 12 }}>You must ensure that any personal data you provide to us is accurate and up to date. MAANGco disclaims liability for losses arising from unauthorised account access due to your failure to safeguard your credentials.</p>
            </Section>

            <Section id="opt-out" num="10" title="Opt-Out">
              <p>You can opt out of promotional and marketing communications at any time by:</p>
              <BulletList items={[
                "Clicking the 'Unsubscribe' link in any marketing email.",
                "Emailing us at support@maangco.com with the subject line 'Unsubscribe'.",
              ]} />
              <p style={{ marginTop: 12 }}>Opting out of marketing emails does not affect transactional communications (receipts, account notices, security alerts) which are necessary for service delivery.</p>
            </Section>

            <Section id="third-party" num="11" title="Third-Party Links">
              <p>The Platform may contain links to third-party websites, resources, or services. MAANGco is not responsible for the privacy practices or content of those external sites. We encourage you to review the privacy policies of any third-party services you visit.</p>
            </Section>

            <Section id="children" num="12" title="Children's Privacy">
              <p>The Platform is intended for users aged 16 and above. We do not knowingly collect personal data from children under 16. If you believe we have inadvertently collected data from a minor, please contact us at <a href="mailto:support@maangco.com" className="ltc-link">support@maangco.com</a> and we will promptly delete such data.</p>
            </Section>

            <Section id="changes" num="13" title="Changes to This Policy">
              <p>We may update this Privacy Policy from time to time to reflect changes in our practices or applicable law. We will notify you of material changes by posting the revised policy on the Platform and updating the "Last updated" date at the top of this page.</p>
              <p style={{ marginTop: 12 }}>Your continued use of the Platform following notice of changes constitutes your acceptance of the revised policy.</p>
            </Section>

            <Section id="governing-law" num="14" title="Governing Law">
              <p>This Privacy Policy is governed by the laws of India, including the Information Technology Act, 2000 and the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011. Any disputes arising under this policy shall be subject to the exclusive jurisdiction of the courts of Bengaluru, Karnataka, India.</p>
            </Section>

            <Section id="contact" num="15" title="Contact Us">
              <p>If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact our Privacy team:</p>
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
              <a href="#" className="lfooter-link">Cancellation and Refund Policy</a>
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

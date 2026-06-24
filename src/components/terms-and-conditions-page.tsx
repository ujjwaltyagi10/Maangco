import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/routes/route-paths";

interface TermsPageProps {
  theme: "light" | "dark";
  onThemeChange: () => void;
}

/* ── reusable section card ── */
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
  { id: "intro",          label: "1. Introduction" },
  { id: "definitions",   label: "2. Definitions" },
  { id: "eligibility",   label: "3. Eligibility" },
  { id: "account",       label: "4. Account & Security" },
  { id: "communications",label: "5. Communications" },
  { id: "purchases",     label: "6. Purchases & Payment" },
  { id: "refunds",       label: "7. Refund & Cancellation" },
  { id: "fair-use",      label: "8. Fair Usage Policy" },
  { id: "content",       label: "9. Intellectual Property" },
  { id: "acceptable-use",label: "10. Acceptable Use" },
  { id: "third-party",   label: "11. Third-Party Services" },
  { id: "modifications", label: "12. Platform Modifications" },
  { id: "force-majeure", label: "13. Force Majeure" },
  { id: "liability",     label: "14. Disclaimers & Liability" },
  { id: "indemnification",label:"15. Indemnification" },
  { id: "termination",   label: "16. Termination" },
  { id: "governing-law", label: "17. Governing Law" },
  { id: "grievance",     label: "18. Grievance Redressal" },
  { id: "data",          label: "19. Data Retention" },
  { id: "general",       label: "20. General Provisions" },
];

export function TermsAndConditionsPage({ theme, onThemeChange }: TermsPageProps) {
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
    // rootMargin pushes the trigger zone to the upper-middle of the viewport
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
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

      {/* ── NAVBAR (same as landing page) ── */}
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
              <button
                type="button"
                className="lnav-theme-btn"
                onClick={onThemeChange}
                aria-label="Toggle theme"
              >
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
              <Link to={ROUTES.landing} className="lnav-sign-in" style={{ textDecoration: "none" }}>
                Sign In
              </Link>
              <Link to={ROUTES.landing} className="lnav-get-started" style={{ textDecoration: "none" }}>
                Back to home →
              </Link>
            </div>

            {/* mobile controls */}
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
                    : <path d="M3 6h14M3 10h14M3 14h14" strokeLinecap="round" />
                  }
                </svg>
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="lnav-mobile-drawer">
              {[
                { href: `${ROUTES.landing}#features`, label: "Features" },
                { href: `${ROUTES.landing}#pricing`,  label: "Pricing" },
                { href: `${ROUTES.landing}#testimonials`, label: "Reviews" },
                { href: `${ROUTES.landing}#faq`,     label: "FAQ" },
              ].map(({ href, label }) => (
                <Link key={href} to={href} className="lnav-mobile-link" style={{ textDecoration: "none" }}
                  onClick={() => setMobileMenuOpen(false)}>
                  {label}
                </Link>
              ))}
              <div className="lnav-mobile-actions">
                <Link to={ROUTES.landing} className="lnav-sign-in" style={{ flex: 1, textDecoration: "none" }}
                  onClick={() => setMobileMenuOpen(false)}>
                  Sign In
                </Link>
                <Link to={ROUTES.landing} className="lnav-get-started" style={{ flex: 1, textDecoration: "none" }}
                  onClick={() => setMobileMenuOpen(false)}>
                  Back to home →
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="ltc-hero">
        <div className="landing-container">
          <p className="ltc-eyebrow">Legal</p>
          <h1 className="ltc-h1">Terms and Conditions</h1>
          <p className="ltc-sub">
            These terms govern your access to and use of MAANGco our website, dashboard,
            DSA question bank, System Design roadmap, and all related services.
          </p>
        </div>
      </section>

      {/* ── BODY: sidebar + content ── */}
      <div className="ltc-layout">
        <div className="landing-container" style={{ display: "flex", gap: "48px", alignItems: "flex-start" }}>

          {/* Sticky sidebar TOC */}
          <aside className="ltc-sidebar">
            <p className="ltc-sidebar-label">On this page</p>
            <nav className="ltc-toc">
              {TOC.map((item) => (
                <TocLink key={item.id} id={item.id} label={item.label} active={activeId === item.id} />
              ))}
            </nav>
          </aside>

          {/* Sections */}
          <div className="ltc-content">

            <Section id="intro" num="01" title="Introduction">
              <p>Welcome to MAANGco. These Terms and Conditions ("Terms") constitute a legally binding agreement between you ("User") and MAANGco ("we", "us", "our") governing your access to and use of our website, web application, dashboards, DSA question bank, System Design roadmap, subscription plans, and all related services (collectively the "Platform").</p>
              <p>By registering an account, subscribing, or using any part of the Platform you confirm that you have read, understood, and agree to be bound by these Terms and by any additional policies referenced herein, including our Privacy Policy and Refund &amp; Cancellation Policy.</p>
              <p>Applicable laws include but are not limited to the Indian Contract Act, 1872; the Information Technology Act, 2000; the Digital Personal Data Protection Act, 2023; and the Consumer Protection Act, 2019.</p>
            </Section>

            <Section id="definitions" num="02" title="Definitions and Interpretation">
              <BulletList items={[
                "Platform — the MAANGco website, web application, dashboards, and all services offered thereon.",
                "Service — DSA question bank, System Design roadmap, progress dashboard, and other learning content.",
                "Subscription — time-limited access to designated Platform features purchased by a User.",
                "User Content — any text, code, comments, or reviews submitted by a User on the Platform.",
                "Order Confirmation — a binding contract is formed only when we dispatch an order confirmation, not upon payment initiation alone.",
              ]} />
            </Section>

            <Section id="eligibility" num="03" title="Eligibility">
              <p>The Platform is intended for users who are 18 years of age or older. By using the Platform you represent and warrant that you meet this requirement.</p>
              <BulletList items={[
                "Users under 18 must use the Platform only under active parental or guardian supervision, with the guardian assuming full financial and legal responsibility.",
                "You must be legally capable of entering into a binding agreement in your jurisdiction.",
                "We may restrict or terminate access where eligibility requirements are not met.",
              ]} />
            </Section>

            <Section id="account" num="04" title="Account Registration and Security">
              <p>You must provide accurate, current, and complete information when creating an account and keep it updated at all times.</p>
              <BulletList items={[
                "Keep your login credentials strictly private. Do not share your password with any other person.",
                "You are solely responsible for all activity that occurs under your account.",
                "Notify us immediately if you believe your account has been accessed without authorisation.",
                "Account sharing — permitting any third party to use your credentials — constitutes a material breach of these Terms and may result in immediate suspension without refund.",
                "We use OTP and email-based verification and may require re-verification for sensitive actions.",
              ]} />
            </Section>

            <Section id="communications" num="05" title="Communications and Marketing Consent">
              <p>By creating an account you consent to receive transactional communications regarding your account, subscription status, billing, security, and service updates. These cannot be opted out of while your account remains active.</p>
              <p>Marketing and promotional messages are optional where required by applicable law. You may manage these preferences through the settings we provide or by using the unsubscribe mechanism in each message.</p>
              <p>Phone numbers voluntarily provided during registration or support interactions authorise us to contact you regarding your account, queries, and relevant service updates.</p>
            </Section>

            <Section id="purchases" num="06" title="Purchases, Billing, and Payment Terms">
              <p>All prices are shown inclusive of applicable taxes before purchase. Tax invoices are issued in compliance with applicable Indian tax regulations.</p>
              <BulletList items={[
                "A subscription gives you access only for the period or plan purchased.",
                "A binding contract is formed only when we dispatch an order confirmation — not merely upon payment initiation.",
                "We may refuse or cancel orders where pricing errors, service unavailability, suspected fraud, or policy violations are identified. Full refunds will be issued for such cancellations within 5 business days.",
                "Chargebacks: contact our support team before initiating any chargeback with your payment provider. Unsupported chargebacks may trigger account suspension. Fraudulent chargebacks will result in permanent access revocation.",
                "Disputes should be raised with our support team within 48 hours for acknowledgement.",
              ]} />
            </Section>

            <Section id="refunds" num="07" title="Refund and Cancellation Policy">
              <p>Digital content and subscription access are generally non-refundable once activated, except where the service was materially defective, not delivered, or significantly misrepresented, or where a refund is required by applicable Indian consumer protection law.</p>
              <p>We do not allow cancellation of an active subscription mid-term. Yearly subscribers retain full access for the remainder of their paid period. Monthly subscribers may choose not to renew at the end of their billing cycle.</p>
              <p>Accounts terminated for violations of these Terms forfeit any remaining access and are not entitled to refunds unless mandated by law.</p>
            </Section>

            <Section id="fair-use" num="08" title="Subscription and Fair Usage Policy">
              <p>Your subscription is personal and non-transferable. The following constitute material breaches of these Terms:</p>
              <BulletList items={[
                "Account Sharing: concurrent logins from multiple devices, or geographically inconsistent access within short periods, will trigger a written notice and a 48-hour remediation window before suspension or termination without refund.",
                "Regional Pricing Abuse: purchasing a discounted regional plan while residing in a different region is prohibited. Detection may result in suspension or a requirement to pay the full applicable rate.",
                "Automated Access: using bots, scripts, crawlers, or scraping tools to access the Platform is strictly prohibited.",
                "Redistribution: copying, recording, downloading, or redistributing any Platform content without written consent is prohibited.",
              ]} />
            </Section>

            <Section id="content" num="09" title="Content and Intellectual Property">
              <p>All Platform content — including DSA problems, System Design materials, roadmaps, videos, branding, software, and design — is owned by MAANGco or licensed to us by third parties and is protected under the Copyright Act, 1957 and other applicable intellectual property laws.</p>
              <p>We grant you a limited, personal, non-transferable, non-sublicensable, non-commercial licence to access and use the Platform content solely for your own private educational purposes during your active subscription period.</p>
              <p>Any unauthorised use, reproduction, or distribution of Platform content may result in immediate account termination and legal action.</p>
            </Section>

            <Section id="acceptable-use" num="10" title="Acceptable Use">
              <p>You agree not to:</p>
              <BulletList items={[
                "Violate any applicable law or regulation.",
                "Exploit, harm, or attempt to exploit or harm minors in any way.",
                "Transmit unsolicited commercial messages (spam).",
                "Impersonate any person or misrepresent your identity or affiliation.",
                "Introduce malware, viruses, or other harmful code.",
                "Attempt to gain unauthorised access to any part of the Platform or its infrastructure.",
                "Scrape, mirror, or copy content without prior written consent.",
                "Reverse-engineer, decompile, or disassemble any part of the Platform.",
                "Use the Platform or its content for commercial purposes without explicit written permission.",
              ]} />
            </Section>

            <Section id="third-party" num="11" title="Third-Party Services">
              <p>The Platform may link to or integrate third-party services (e.g. payment processors, authentication providers). We are not responsible for the content, terms, or privacy practices of any third-party service. Your use of third-party services is governed by their respective terms.</p>
            </Section>

            <Section id="modifications" num="12" title="Platform Modifications">
              <p>We reserve the right to modify, suspend, or discontinue any part of the Platform at our discretion. For material changes affecting paid subscribers, we will endeavour to provide reasonable prior notice unless immediate action is required for legal or security reasons.</p>
              <p>Pricing changes apply prospectively only and do not affect active subscription periods already paid for.</p>
            </Section>

            <Section id="force-majeure" num="13" title="Force Majeure">
              <p>Neither party shall be liable for any failure or delay in performance caused by circumstances beyond their reasonable control, including natural disasters, pandemics, government actions, war, cyberattacks, or infrastructure failures. The affected party must notify the other promptly and take reasonable steps to mitigate the impact.</p>
            </Section>

            <Section id="liability" num="14" title="Disclaimers and Limitation of Liability">
              <p>The Platform is provided on an "as-is" and "as-available" basis without warranties of any kind. In particular:</p>
              <BulletList items={[
                "We do not guarantee continuous or error-free access to the Platform.",
                "We do not guarantee any specific interview outcome, job offer, or career result.",
                "Platform content is a supplementary learning resource, not a replacement for formal education or professional advice.",
                "To the maximum extent permitted by applicable law, our aggregate liability is limited to the fees actually paid by you for the relevant subscription or service.",
              ]} />
              <p>Nothing in these Terms limits liability for death or personal injury caused by negligence, fraud, wilful misconduct, or any liability that cannot be excluded under the Consumer Protection Act, 2019.</p>
            </Section>

            <Section id="indemnification" num="15" title="Indemnification">
              <p>You agree to indemnify and hold harmless MAANGco and its officers, directors, employees, and agents from and against any third-party claims, damages, losses, and costs (including reasonable legal fees) arising from your breach of these Terms, your violation of any applicable law, or your misuse of the Platform.</p>
            </Section>

            <Section id="termination" num="16" title="Suspension and Termination">
              <p>We may suspend or terminate your account if we reasonably believe you have breached these Terms, engaged in fraudulent activity, violated the fair use policy, or acted in a manner harmful to the Platform or other users.</p>
              <p>Where practicable, we will provide written notice and a reasonable opportunity to remedy the breach. Immediate action may be taken for severe violations. No refunds will be issued upon termination for cause unless required by law.</p>
              <p>Provisions relating to intellectual property, liability, indemnification, and governing law survive termination.</p>
            </Section>

            <Section id="governing-law" num="17" title="Governing Law and Jurisdiction">
              <p>These Terms are governed by the laws of India. Disputes are subject to the exclusive jurisdiction of Indian courts, without prejudice to your rights as a consumer to file complaints before Consumer Disputes Redressal Commissions under the Consumer Protection Act, 2019.</p>
              <p>For disputes not resolved through direct support contact, the parties agree to attempt resolution through binding arbitration under the Arbitration and Conciliation Act, 1996.</p>
            </Section>

            <Section id="grievance" num="18" title="Grievance Redressal">
              <p>If you have any complaint or grievance, please contact us. We will acknowledge your complaint within 72 hours and endeavour to resolve it within 30 days.</p>
              <div className="ltc-highlight-box">
                <p className="ltc-highlight-title">Grievance Contact</p>
                <p>Email: <a href="mailto:support@maangco.com" className="ltc-link">support@maangco.com</a></p>
                <p>Acknowledgement: within 72 hours</p>
                <p>Resolution target: 30 days</p>
              </div>
            </Section>

            <Section id="data" num="19" title="Data Retention and Deletion">
              <p>We retain your personal data only for as long as necessary to provide the Platform services or comply with legal obligations. You may request deletion of your account and personal data by contacting us at the email above.</p>
              <BulletList items={[
                "Deletion or anonymisation will be completed within 30 days of a verified request.",
                "We may retain certain data where required for legal compliance, dispute resolution, fraud prevention, or security purposes.",
                "Our Privacy Policy provides additional detail on data practices under the Digital Personal Data Protection Act, 2023.",
              ]} />
            </Section>

            <Section id="general" num="20" title="General Provisions">
              <BulletList items={[
                "Severability: if any provision is found invalid or unenforceable, the remaining provisions continue in full force.",
                "Non-Waiver: failure to enforce any right does not constitute a waiver of that right for the future.",
                "Entire Agreement: these Terms together with the Privacy Policy and Refund & Cancellation Policy constitute the entire agreement between you and MAANGco.",
                "Assignment: we may assign our rights and obligations to a successor entity. You may not assign your rights without our prior written consent.",
                "Notices: we will send notices to your registered email. Notices to us should be directed to support@maangco.com.",
              ]} />
            </Section>

            <p className="ltc-footer-note">
              Last updated: June 24, 2026 · Questions? <a href="mailto:support@maangco.com" className="ltc-link">support@maangco.com</a>
            </p>
          </div>
        </div>
      </div>

      {/* ── FOOTER (same as landing page) ── */}
      <footer className="lfooter">
        <div className="landing-container">
          <div className="lfooter-center">
            <div className="lfooter-logo-mark-wrap">
              <svg viewBox="0 0 20 20" width="26" height="26">
                <path d="M10 1L2 6v8l8 5 8-5V6L10 1zm0 2.3L16 7v6l-6 3.7L4 13V7l6-3.7z" fill="white" />
              </svg>
            </div>
            <div className="lfooter-links-row">
              <a href={ROUTES.termsConditions} className="lfooter-link">Terms and Conditions</a>
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

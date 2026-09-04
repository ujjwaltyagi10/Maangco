import { COMPANY_LOGO_VARIANTS } from "@/lib/company-logos";

interface CompanyLogoProps {
  name: string;
  src: string;
  alt?: string;
  className?: string;
}

/**
 * Renders a company logo. For companies in COMPANY_LOGO_VARIANTS (whose
 * default mark is dark and disappears on dark-mode surfaces), both a
 * light- and dark-theme image are rendered and toggled via CSS
 * ([data-theme="dark"] in index.css) so it works without threading theme
 * state through every caller.
 */
export function CompanyLogo({ name, src, alt = "", className }: CompanyLogoProps) {
  const variant = COMPANY_LOGO_VARIANTS[name];

  if (!variant) {
    return <img src={src} alt={alt} className={className} />;
  }

  const cls = className ? `${className} ` : "";
  return (
    <>
      <img src={variant.light} alt={alt} className={`${cls}company-logo-light`} />
      <img src={variant.dark} alt={alt} className={`${cls}company-logo-dark`} />
    </>
  );
}

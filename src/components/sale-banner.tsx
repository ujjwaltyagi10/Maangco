import { Sparkles, ArrowRight, X } from "lucide-react";
import type { ActiveCampaign } from "@/lib/discounts-api";

interface SaleBannerProps {
  campaign: ActiveCampaign;
  remainingMs: number;
  onDismiss: () => void;
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function breakdown(ms: number): Countdown {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

function discountLabel(campaign: ActiveCampaign): string {
  return campaign.discountType === "percent" ? `${campaign.discountValue}% off` : `₹${campaign.discountValue} off`;
}

export function SaleBanner({ campaign, remainingMs, onDismiss }: SaleBannerProps) {
  const t = breakdown(remainingMs);

  return (
    <div className="sale-banner">
      <div className="sale-banner-inner">
        <Sparkles size={15} strokeWidth={2.25} className="sale-banner-icon" aria-hidden="true" />
        <span className="sale-banner-text">
          <strong>{campaign.name}</strong>
          <span className="sale-banner-sep" aria-hidden="true">·</span>
          {discountLabel(campaign)} on Premium
        </span>

        <div className="sale-banner-countdown" aria-label={`Offer ends in ${t.days} days ${t.hours} hours ${t.minutes} minutes ${t.seconds} seconds`}>
          {t.days > 0 && (
            <>
              <span className="sale-banner-timebox">{pad(t.days)}<em>d</em></span>
              <span className="sale-banner-colon">:</span>
            </>
          )}
          <span className="sale-banner-timebox">{pad(t.hours)}<em>h</em></span>
          <span className="sale-banner-colon">:</span>
          <span className="sale-banner-timebox">{pad(t.minutes)}<em>m</em></span>
          <span className="sale-banner-colon">:</span>
          <span className="sale-banner-timebox">{pad(t.seconds)}<em>s</em></span>
        </div>

        <a href="#pricing" className="sale-banner-cta">
          <span>Claim offer</span>
          <ArrowRight size={13} strokeWidth={2.25} />
        </a>

        <button type="button" className="sale-banner-close" onClick={onDismiss} aria-label="Dismiss">
          <X size={14} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}

import type { CSSProperties } from "react";

const shimmerStyle: CSSProperties = {
  background: "linear-gradient(90deg, var(--shimmer-base, rgba(255,255,255,0.04)) 25%, var(--shimmer-high, rgba(255,255,255,0.1)) 50%, var(--shimmer-base, rgba(255,255,255,0.04)) 75%)",
  backgroundSize: "200% 100%",
  animation: "shimmer-sweep 1.6s infinite linear",
  borderRadius: 6,
  flexShrink: 0,
};

interface SkeletonProps {
  w?: number | string;
  h?: number | string;
  radius?: number;
  style?: CSSProperties;
  className?: string;
}

export function Skeleton({ w = "100%", h = 14, radius = 6, style, className }: SkeletonProps) {
  return (
    <div
      className={className}
      style={{
        ...shimmerStyle,
        width: w,
        height: h,
        borderRadius: radius,
        ...style,
      }}
    />
  );
}

// Injects the keyframe once
const STYLE_ID = "shimmer-keyframe";
if (typeof document !== "undefined" && !document.getElementById(STYLE_ID)) {
  const s = document.createElement("style");
  s.id = STYLE_ID;
  s.textContent = `
    @keyframes shimmer-sweep {
      0%   { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `;
  document.head.appendChild(s);
}

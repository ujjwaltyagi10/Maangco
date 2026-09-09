import { Skeleton } from "./ui/shimmer";

export function DashboardPanelSkeleton() {
  return (
    <div className="dp-root">
      <div className="dp-kits">
        <div className="dp-kits-head">
          <div className="dp-kits-head-text">
            <Skeleton w={70} h={11} style={{ marginBottom: 10 }} />
            <Skeleton w={220} h={24} />
          </div>
          <Skeleton w={130} h={13} />
        </div>
        <div className="dp-kits-row">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="dp-kit-card" style={{ pointerEvents: "none" }}>
              <Skeleton w={44} h={44} radius={10} />
              <Skeleton w="70%" h={16} />
              <Skeleton w={60} h={12} />
            </div>
          ))}
        </div>
      </div>
      {/* Only 2 real modules render (DSA, System Design) — see DashboardPanel's `modules` */}
      <div className="dp-modules">
        {[0, 1].map((i) => (
          <div key={i} className="dp-module-card" style={{ pointerEvents: "none" }}>
            <div className="dp-module-top">
              <Skeleton w={20} h={20} radius={5} />
              <Skeleton w={64} h={18} radius={20} />
            </div>
            <Skeleton w="60%" h={18} />
            <Skeleton w="100%" h={12} />
            <div className="dp-module-bar-wrap">
              <Skeleton h={5} radius={3} style={{ flex: 1 }} />
              <Skeleton w={22} h={11} />
            </div>
            <div className="dp-module-footer">
              <Skeleton w={90} h={16} />
              <Skeleton w={78} h={30} radius={10} />
            </div>
          </div>
        ))}
      </div>
      <div className="dp-section-head">
        <Skeleton w={6} h={6} radius={99} />
        <Skeleton w={120} h={14} />
      </div>
      {/* Only 3 real tips are active — see DashboardPanel's `tips` (others commented out) */}
      <div className="dp-tips">
        {[0, 1, 2].map((i) => (
          <div key={i} className="dp-tip">
            <Skeleton w={32} h={32} radius={8} />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
              <Skeleton w="50%" h={13} />
              <Skeleton w="85%" h={11} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

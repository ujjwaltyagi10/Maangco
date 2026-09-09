import { Skeleton } from "./ui/shimmer";

export function SystemDesignPanelSkeleton() {
  return (
    <div className="sd-panel">
      {/* ── LEFT: main content skeleton — mirrors dsa-header-card / dsa-header-bottom / q-table-card in SystemDesignPanel ── */}
      <div className="sd-content">
        <div className="dsa-header-card">
          <div className="dsa-header-left">
            <Skeleton w={170} h={19} style={{ marginBottom: 6 }} />
            <Skeleton w={260} h={12} />
          </div>
          <div className="dsa-header-right">
            <Skeleton w={56} h={56} radius={999} />
            <Skeleton w={90} h={30} radius={8} />
            <Skeleton w={170} h={30} radius={8} />
          </div>
        </div>

        <div className="dsa-header-bottom">
          <div className="dsa-search-wrap">
            <Skeleton w="100%" h={36} radius={10} />
          </div>
          <Skeleton w={120} h={36} radius={10} />
          <Skeleton w={130} h={36} radius={10} />
          <Skeleton w={110} h={36} radius={10} />
        </div>

        <div className="table-wrap">
          <div className="q-table-card">
            <table className="q-table q-table--sd">
              <thead>
                <tr>
                  <th style={{ width: 36 }} />
                  <th><Skeleton w={16} h={11} /></th>
                  <th><Skeleton w={60} h={11} /></th>
                  <th><Skeleton w={60} h={11} /></th>
                  <th><Skeleton w={70} h={11} /></th>
                  <th><Skeleton w={60} h={11} /></th>
                  <th><Skeleton w={60} h={11} /></th>
                  <th><Skeleton w={55} h={11} /></th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 10 }).map((_, i) => (
                  <tr key={i} className="q-row">
                    <td><Skeleton w={16} h={16} radius={4} /></td>
                    <td className="q-num"><Skeleton w={24} h={12} /></td>
                    <td className="q-title"><Skeleton w={`${40 + (i % 5) * 10}%`} h={13} /></td>
                    <td><Skeleton w={46} h={22} radius={20} /></td>
                    <td><Skeleton w={38} h={22} radius={20} /></td>
                    <td><Skeleton w={80} h={22} radius={20} /></td>
                    <td><Skeleton w={52} h={12} /></td>
                    <td><Skeleton w={48} h={13} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── RIGHT: company sidebar skeleton — collapsed by default (matches SystemDesignPanel's initial sidebarCollapsed=true) ── */}
      <aside className="sd-cosb sd-cosb--collapsed">
        <div className="sd-cosb-collapse-toggle">
          <Skeleton w={28} h={28} radius={7} />
        </div>
        <div className="sd-cosb-initials-strip">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} w={36} h={36} radius={9} />
          ))}
        </div>
        <div className="sd-cosb-collapsed-footer">
          <Skeleton w={36} h={11} />
        </div>
      </aside>
    </div>
  );
}

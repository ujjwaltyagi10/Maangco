import { Skeleton } from "./ui/shimmer";

interface DsaPanelSkeletonProps {
  /** Matches DsaPanel's lockedCompanyId prop — hides the identity header
   * and the company sidebar on the locked single-company kit page. */
  lockedCompanyId?: string;
}

export function DsaPanelSkeleton({ lockedCompanyId }: DsaPanelSkeletonProps) {
  return (
    <div className="dsa-panel">
      {/* ── LEFT: main content skeleton — mirrors dsa-header-card / dsa-header-bottom / q-table-card in DsaPanel ── */}
      <div className="dsa-main">
        {!lockedCompanyId && (
          <div className="dsa-header-card">
            <div className="dsa-header-left">
              <Skeleton w={160} h={19} style={{ marginBottom: 4 }} />
              <Skeleton w={220} h={12} />
            </div>
            <div className="dsa-header-right">
              <Skeleton w={56} h={56} radius={999} />
              <Skeleton w={90} h={30} radius={8} />
              <Skeleton w={170} h={30} radius={8} />
            </div>
          </div>
        )}

        <div className="dsa-header-bottom">
          <div className="dsa-search-wrap">
            <Skeleton w="100%" h={36} radius={10} />
          </div>
          <Skeleton w={110} h={36} radius={10} />
          <Skeleton w={90} h={36} radius={10} />
          <Skeleton w={70} h={36} radius={10} />
          <Skeleton w={140} h={36} radius={10} />
        </div>

        {/* Table */}
        <div className="table-wrap">
          <div className="q-table-card">
            <table className="q-table">
              <thead>
                <tr>
                  <th style={{ width: 36 }} />
                  <th><Skeleton w={16} h={11} /></th>
                  <th><Skeleton w={80} h={11} /></th>
                  <th><Skeleton w={54} h={11} /></th>
                  <th><Skeleton w={70} h={11} /></th>
                  <th><Skeleton w={60} h={11} /></th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 10 }).map((_, i) => (
                  <tr key={i} className="q-row">
                    <td><Skeleton w={16} h={16} radius={4} /></td>
                    <td className="q-num"><Skeleton w={28} h={12} /></td>
                    <td className="q-title"><Skeleton w={`${42 + (i % 5) * 9}%`} h={13} /></td>
                    <td><Skeleton w={52} h={22} radius={20} /></td>
                    <td><Skeleton w={60} h={10} radius={20} /></td>
                    <td><Skeleton w={70} h={20} radius={20} /></td>
                    <td />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── RIGHT: company sidebar skeleton — collapsed by default (matches DsaPanel's initial sidebarCollapsed=true), hidden on the locked kit page ── */}
      {!lockedCompanyId && (
        <aside className="dsa-sidebar dsa-sidebar--collapsed">
          <div className="dsa-sidebar-collapse-toggle">
            <Skeleton w={28} h={28} radius={7} />
          </div>
          <div className="dsa-sidebar-logo-strip">
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} w={36} h={36} radius={9} />
            ))}
          </div>
          <div className="dsa-sidebar-collapsed-footer">
            <Skeleton w={36} h={11} />
          </div>
        </aside>
      )}
    </div>
  );
}

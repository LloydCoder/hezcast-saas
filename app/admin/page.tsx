// Mock tenant data — replace with DB query in production
const MOCK_TENANTS = [
  { id: "t001", email: "user@giftmode.app",   plan: "pro",     credits: 42, jobs: 18, created: "2026-05-01" },
  { id: "t002", email: "dev@tinlance.com",    plan: "agency",  credits: 287, jobs: 31, created: "2026-04-15" },
  { id: "t003", email: "hello@webtemify.com", plan: "starter", credits: 8,  jobs: 7,  created: "2026-05-10" },
  { id: "t004", email: "founder@startup.io",  plan: "free",    credits: 1,  jobs: 3,  created: "2026-05-20" },
  { id: "t005", email: "agency@content.co",   plan: "agency",  credits: 156, jobs: 44, created: "2026-04-28" },
];

const PLAN_COL: Record<string, string> = {
  free: "#4A6080", starter: "#8AA0BC", pro: "#00D4FF", agency: "#10B981",
};

export default async function AdminPage() {
  const stats = {
    tenants:    MOCK_TENANTS.length,
    paid:       MOCK_TENANTS.filter(t => t.plan !== "free").length,
    mrr:        MOCK_TENANTS.reduce((a, t) => a + ({ free: 0, starter: 19, pro: 49, agency: 149 }[t.plan] || 0), 0),
    totalJobs:  MOCK_TENANTS.reduce((a, t) => a + t.jobs, 0),
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-[28px] tracking-[0.04em] text-snow leading-none">Admin Overview</h1>
        <div className="font-mono text-[11px] text-muted mt-1">// {stats.tenants} tenants · ${stats.mrr} MRR</div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-3.5">
        {[
          { label: "Total Tenants", value: stats.tenants,  color: "text-cyan" },
          { label: "Paid Users",    value: stats.paid,     color: "text-emerald" },
          { label: "MRR",           value: `$${stats.mrr}`,color: "text-emerald" },
          { label: "Total Jobs",    value: stats.totalJobs, color: "text-bright" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-ink2 border border-border rounded-xl p-5">
            <div className="font-mono text-[10px] text-muted uppercase tracking-[0.08em] mb-2">{label}</div>
            <div className={`font-display text-[38px] tracking-tight ${color} leading-none`}>{value}</div>
          </div>
        ))}
      </div>

      {/* Tenants table */}
      <div className="bg-ink2 border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <div className="text-[13px] font-bold text-bright">All Tenants</div>
          <span className="font-mono text-[11px] text-muted">{MOCK_TENANTS.length} total</span>
        </div>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-border bg-ink/30">
              {["Email","Plan","Credits","Jobs","Joined"].map(h => (
                <th key={h} className="text-left px-5 py-3 font-mono text-[10px] tracking-[0.1em] text-muted uppercase font-normal">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {MOCK_TENANTS.map(t => (
              <tr key={t.id} className="hover:bg-snow/[0.01] transition-colors">
                <td className="px-5 py-3.5 text-[13px] font-medium text-bright">{t.email}</td>
                <td className="px-5 py-3.5">
                  <span className="text-[11px] px-2.5 py-1 rounded-full font-mono font-semibold border"
                    style={{ color: PLAN_COL[t.plan], borderColor: `${PLAN_COL[t.plan]}44`, background: `${PLAN_COL[t.plan]}10` }}>
                    {t.plan}
                  </span>
                </td>
                <td className="px-5 py-3.5 font-mono text-[12px] text-cyan">{t.credits}</td>
                <td className="px-5 py-3.5 font-mono text-[12px] text-txt">{t.jobs}</td>
                <td className="px-5 py-3.5 font-mono text-[11px] text-muted">{t.created}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Revenue by plan */}
      <div className="bg-ink2 border border-border rounded-xl p-5">
        <div className="text-[13px] font-bold text-bright mb-4">Revenue Breakdown</div>
        <div className="grid grid-cols-4 gap-3">
          {[
            { plan: "Free",    count: MOCK_TENANTS.filter(t=>t.plan==="free").length,    mrr: 0,   color: "#4A6080" },
            { plan: "Starter", count: MOCK_TENANTS.filter(t=>t.plan==="starter").length, mrr: 19,  color: "#8AA0BC" },
            { plan: "Pro",     count: MOCK_TENANTS.filter(t=>t.plan==="pro").length,     mrr: 49,  color: "#00D4FF" },
            { plan: "Agency",  count: MOCK_TENANTS.filter(t=>t.plan==="agency").length,  mrr: 149, color: "#10B981" },
          ].map(({ plan, count, mrr, color }) => (
            <div key={plan} className="bg-ink border border-border rounded-xl p-4">
              <div className="font-mono text-[10px] text-muted uppercase tracking-[0.08em] mb-2">{plan}</div>
              <div className="font-display text-[28px] leading-none mb-1" style={{ color }}>{count}</div>
              <div className="font-mono text-[11px] text-muted">users</div>
              <div className="mt-2 font-mono text-[12px] text-emerald">${count * mrr}/mo</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

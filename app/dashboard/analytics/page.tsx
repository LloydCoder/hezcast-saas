"use client";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const WEEKLY = [
  { day: "Mon", videos: 4,  qa_pass: 4,  render_avg: 112 },
  { day: "Tue", videos: 7,  qa_pass: 6,  render_avg: 128 },
  { day: "Wed", videos: 5,  qa_pass: 5,  render_avg: 108 },
  { day: "Thu", videos: 9,  qa_pass: 8,  render_avg: 134 },
  { day: "Fri", videos: 12, qa_pass: 11, render_avg: 119 },
  { day: "Sat", videos: 6,  qa_pass: 6,  render_avg: 105 },
  { day: "Sun", videos: 8,  qa_pass: 7,  render_avg: 122 },
];

const BRANDS = [
  { name: "GiftMode",  videos: 21, color: "#FF6B9D" },
  { name: "Tinlance",  videos: 14, color: "#00D4FF" },
  { name: "WebTemify", videos: 8,  color: "#7C3AED" },
  { name: "HezCast",   videos: 8,  color: "#00D4FF" },
];

const HOOKS = [
  { variant: "Hook 1", selected: 18, color: "#00D4FF" },
  { variant: "Hook 2", selected: 24, color: "#FF6B9D" },
  { variant: "Hook 3", selected: 12, color: "#7C3AED" },
  { variant: "Hook 4", selected: 8,  color: "#F59E0B" },
  { variant: "Hook 5", selected: 6,  color: "#10B981" },
];

const TOOLTIP_STYLE = {
  contentStyle: { background: "#0F131C", border: "1px solid #1A2333", borderRadius: 8, fontSize: 12, fontFamily: "monospace" },
  cursor: { fill: "rgba(0,212,255,0.04)" },
};

function StatCard({ label, value, sub, color = "text-cyan" }: { label: string; value: string | number; sub: string; color?: string }) {
  return (
    <div className="bg-ink2 border border-border rounded-xl p-5">
      <div className="font-mono text-[10px] text-muted uppercase tracking-[0.08em] mb-2">{label}</div>
      <div className={`font-display text-[38px] tracking-tight ${color} leading-none mb-1`}>{value}</div>
      <div className="text-[11px] text-muted">{sub}</div>
    </div>
  );
}

export default function AnalyticsPage() {
  const totalVideos = WEEKLY.reduce((a, d) => a + d.videos, 0);
  const totalQA     = WEEKLY.reduce((a, d) => a + d.qa_pass, 0);
  const qaRate      = ((totalQA / totalVideos) * 100).toFixed(1);
  const avgRender   = Math.round(WEEKLY.reduce((a, d) => a + d.render_avg, 0) / WEEKLY.length);
  const topHook     = HOOKS.reduce((a, h) => h.selected > a.selected ? h : a);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-[28px] tracking-[0.04em] text-snow leading-none">Analytics</h1>
        <div className="font-mono text-[11px] text-muted mt-1">// performance insights — last 7 days</div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-4 gap-3.5">
        <StatCard label="Videos This Week"  value={totalVideos} sub="across all brands"   color="text-cyan" />
        <StatCard label="QA Pass Rate"      value={`${qaRate}%`} sub="auto-retry on fail" color="text-emerald" />
        <StatCard label="Avg Render Time"   value={`${avgRender}s`} sub="script → final.mp4" color="text-amber" />
        <StatCard label="Top Hook Variant"  value={topHook.variant} sub={`Selected ${topHook.selected} times`} color="text-pink" />
      </div>

      {/* Row 1: Weekly volume + render time */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-ink2 border border-border rounded-xl">
          <div className="px-5 py-4 border-b border-border">
            <div className="text-[13px] font-bold text-bright">📊 Videos Generated</div>
            <div className="font-mono text-[10px] text-muted mt-0.5">Total vs QA passed — this week</div>
          </div>
          <div className="p-4">
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={WEEKLY} barCategoryGap="30%" barGap={3}>
                <XAxis dataKey="day" stroke="#2E4060" tick={{ fontSize: 10, fontFamily: "monospace", fill: "#4A6080" }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip {...TOOLTIP_STYLE} />
                <Bar dataKey="videos"  fill="#00D4FF" opacity={0.6} radius={[3,3,0,0]} name="Total" />
                <Bar dataKey="qa_pass" fill="#10B981" opacity={0.9} radius={[3,3,0,0]} name="QA Pass" />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex gap-4 justify-center mt-1">
              {[["Total","#00D4FF"],["QA Pass","#10B981"]].map(([l, c]) => (
                <div key={l} className="flex items-center gap-1.5 font-mono text-[10px] text-muted">
                  <div className="w-2 h-2 rounded-sm" style={{ background: c }} />{l}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-ink2 border border-border rounded-xl">
          <div className="px-5 py-4 border-b border-border">
            <div className="text-[13px] font-bold text-bright">⏱️ Avg Render Time</div>
            <div className="font-mono text-[10px] text-muted mt-0.5">Seconds from submit to final.mp4</div>
          </div>
          <div className="p-4">
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={WEEKLY}>
                <XAxis dataKey="day" stroke="#2E4060" tick={{ fontSize: 10, fontFamily: "monospace", fill: "#4A6080" }} axisLine={false} tickLine={false} />
                <YAxis hide domain={["dataMin - 10", "dataMax + 10"]} />
                <Tooltip {...TOOLTIP_STYLE} formatter={(v: number) => [`${v}s`, "Avg Render"]} />
                <Line type="monotone" dataKey="render_avg" stroke="#F59E0B" strokeWidth={2} dot={{ fill: "#F59E0B", r: 3 }} activeDot={{ r: 5 }} name="Render (s)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2: Brand breakdown + hook selection */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-ink2 border border-border rounded-xl">
          <div className="px-5 py-4 border-b border-border">
            <div className="text-[13px] font-bold text-bright">🎭 Videos by Brand</div>
          </div>
          <div className="p-5 flex flex-col gap-4">
            {BRANDS.map(b => {
              const pct = Math.round((b.videos / totalVideos) * 100);
              return (
                <div key={b.name}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[13px] font-semibold text-bright">{b.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[11px] text-muted">{b.videos} videos</span>
                      <span className="font-mono text-[11px]" style={{ color: b.color }}>{pct}%</span>
                    </div>
                  </div>
                  <div className="h-2 bg-border rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: b.color }} />
                  </div>
                </div>
              );
            })}
            <div className="pt-3 border-t border-border flex justify-between">
              <span className="text-[12px] text-txt">Total videos</span>
              <span className="font-display text-[20px] text-cyan leading-none">{totalVideos}</span>
            </div>
          </div>
        </div>

        <div className="bg-ink2 border border-border rounded-xl">
          <div className="px-5 py-4 border-b border-border">
            <div className="text-[13px] font-bold text-bright">🎣 Hook Variant Performance</div>
            <div className="font-mono text-[10px] text-muted mt-0.5">Which variants get selected most</div>
          </div>
          <div className="p-4">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={HOOKS} layout="vertical" barCategoryGap="20%">
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="variant" stroke="#2E4060" tick={{ fontSize: 11, fontFamily: "monospace", fill: "#4A6080" }} axisLine={false} tickLine={false} width={60} />
                <Tooltip {...TOOLTIP_STYLE} formatter={(v: number) => [v, "Selected"]} />
                <Bar dataKey="selected" radius={[0,3,3,0]} name="Selected">
                  {HOOKS.map((h, i) => <Cell key={i} fill={h.color} opacity={0.8} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-2 p-3 bg-ink border border-border rounded-lg">
              <div className="font-mono text-[10px] text-muted uppercase tracking-[0.08em] mb-1">Insight</div>
              <div className="text-[12px] text-txt">Hook 2 wins most often — emotionally direct openers outperform curiosity framing for GiftMode.</div>
            </div>
          </div>
        </div>
      </div>

      {/* Credit usage */}
      <div className="bg-ink2 border border-border rounded-xl">
        <div className="px-5 py-4 border-b border-border">
          <div className="text-[13px] font-bold text-bright">💳 Credit Consumption</div>
          <div className="font-mono text-[10px] text-muted mt-0.5">Monthly usage vs allocation</div>
        </div>
        <div className="p-5 grid grid-cols-3 gap-6">
          {[
            { label: "Used this month",  value: 22,  total: 60,  color: "#00D4FF" },
            { label: "Remaining",        value: 38,  total: 60,  color: "#10B981" },
            { label: "Rollover credits", value: 0,   total: 60,  color: "#F59E0B" },
          ].map(({ label, value, total, color }) => (
            <div key={label} className="text-center">
              <div className="font-mono text-[10px] text-muted uppercase tracking-[0.08em] mb-3">{label}</div>
              <div className="relative w-24 h-24 mx-auto mb-3">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1A2333" strokeWidth="2.5" />
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke={color} strokeWidth="2.5"
                    strokeDasharray={`${(value/total)*100} 100`} strokeLinecap="round" opacity={0.85} />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-display text-[22px]" style={{ color }}>{value}</span>
                </div>
              </div>
              <div className="font-mono text-[11px] text-muted">of {total} total</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

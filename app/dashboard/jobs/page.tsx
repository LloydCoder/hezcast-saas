"use client";
import { useState, useEffect, useCallback } from "react";
import { api, type Job } from "@/lib/api";

const BRAND_COL: Record<string, string> = {
  GiftMode: "#FF6B9D", Tinlance: "#00D4FF",
  WebTemify: "#7C3AED", HezCast: "#00D4FF",
};

const STATUS_CFG: Record<string, { label: string; color: string; bg: string }> = {
  queued:             { label: "Queued",       color: "#4A6080", bg: "rgba(74,96,128,0.12)" },
  generating_hooks:   { label: "Generating",   color: "#F59E0B", bg: "rgba(245,158,11,0.12)" },
  awaiting_selection: { label: "Pick Hook",    color: "#7C3AED", bg: "rgba(124,58,237,0.12)" },
  processing:         { label: "Processing",   color: "#00D4FF", bg: "rgba(0,212,255,0.12)" },
  composing:          { label: "Composing",    color: "#00D4FF", bg: "rgba(0,212,255,0.12)" },
  qa_check:           { label: "QA Check",     color: "#F59E0B", bg: "rgba(245,158,11,0.12)" },
  completed:          { label: "Complete",     color: "#10B981", bg: "rgba(16,185,129,0.12)" },
  failed:             { label: "Failed",       color: "#EF4444", bg: "rgba(239,68,68,0.12)" },
  needs_review:       { label: "Review",       color: "#F59E0B", bg: "rgba(245,158,11,0.12)" },
};

const PIPELINE_STAGES = [
  { key: "generating_hooks", label: "Script",  icon: "✍️" },
  { key: "processing",       label: "Voice",   icon: "🎙️" },
  { key: "composing",        label: "Compose", icon: "🎬" },
  { key: "qa_check",         label: "QA",      icon: "🔍" },
  { key: "completed",        label: "Done",    icon: "✅" },
];

const STAGE_ORDER = [
  "queued","generating_hooks","awaiting_selection",
  "processing","composing","qa_check","completed",
];

// Mock data for when API is offline
const MOCK: Job[] = [
  { job_id: "4f7a-2c1e", brand: "GiftMode",  topic: "forgot birthday gift last minute",  status: "completed",   duration_sec: 24.3,  render_time_ms: 134200, qa_passed: true,  llm_used: "claude",  output_path: "/storage/outputs/4f7a/final.mp4", output_url: null, error_message: null, thumbnail_paths: null, created_at: new Date(Date.now()-3600000).toISOString(),  completed_at: null },
  { job_id: "3e8b-9a2f", brand: "Tinlance",  topic: "your website got hacked at 2am",    status: "composing",   duration_sec: null,  render_time_ms: null,   qa_passed: null,  llm_used: "claude",  output_path: null, output_url: null, error_message: null, thumbnail_paths: null, created_at: new Date(Date.now()-1200000).toISOString(),  completed_at: null },
  { job_id: "2d5c-7f8a", brand: "WebTemify", topic: "build a landing page in 10 minutes", status: "completed",   duration_sec: 22.1,  render_time_ms: 118400, qa_passed: true,  llm_used: "claude",  output_path: null, output_url: null, error_message: null, thumbnail_paths: null, created_at: new Date(Date.now()-7200000).toISOString(),  completed_at: null },
  { job_id: "1a3d-6e4b", brand: "GiftMode",  topic: "surprise anniversary gift idea",    status: "completed",   duration_sec: 25.7,  render_time_ms: 151000, qa_passed: true,  llm_used: "gpt-4o", output_path: null, output_url: null, error_message: null, thumbnail_paths: null, created_at: new Date(Date.now()-14400000).toISOString(), completed_at: null },
  { job_id: "0b1a-4c9d", brand: "Tinlance",  topic: "NIS2 compliance deadline approaching", status: "failed", duration_sec: null,  render_time_ms: null,   qa_passed: false, llm_used: "ollama", output_path: null, output_url: null, error_message: "FFmpeg render timeout", thumbnail_paths: null, created_at: new Date(Date.now()-86400000).toISOString(), completed_at: null },
];

function PipelineTracker({ status }: { status: string }) {
  const idx = STAGE_ORDER.indexOf(status);
  return (
    <div className="flex items-center">
      {PIPELINE_STAGES.map((s, i) => {
        const sIdx  = STAGE_ORDER.indexOf(s.key);
        const done  = idx > sIdx || status === "completed";
        const active= STAGE_ORDER[idx] === s.key;
        const c     = done ? "#10B981" : active ? "#00D4FF" : "#1E2A3D";
        return (
          <div key={s.key} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-[11px] transition-all"
                style={{ borderColor: c, color: c, background: done ? "rgba(16,185,129,0.1)" : active ? "rgba(0,212,255,0.1)" : "transparent" }}>
                {done ? "✓" : s.icon}
              </div>
              <span className="font-mono text-[9px] tracking-[0.06em]" style={{ color: active ? "#00D4FF" : done ? "#10B981" : "#2E4060" }}>{s.label}</span>
            </div>
            {i < PIPELINE_STAGES.length - 1 && (
              <div className="w-5 h-px mx-1 mb-4 transition-all" style={{ background: done ? "#10B981" : "#1A2333" }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function JobDetail({ job, onClose }: { job: Job; onClose: () => void }) {
  return (
    <div className="bg-ink2 border border-border rounded-xl mt-4">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div className="flex items-center gap-2 text-[13px] font-bold text-bright">
          Job Detail — <span className="font-mono text-[11px] text-muted ml-1">{job.job_id}</span>
        </div>
        <button onClick={onClose} className="text-dim hover:text-bright text-[18px] transition-colors leading-none">×</button>
      </div>
      <div className="p-5 flex flex-col gap-5">
        {/* Pipeline */}
        <div>
          <div className="font-mono text-[10px] tracking-[0.1em] text-muted uppercase mb-3">Pipeline Status</div>
          <PipelineTracker status={job.status} />
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Brand",   value: job.brand },
            { label: "LLM",     value: job.llm_used || "—" },
            { label: "Duration",value: job.duration_sec ? `${job.duration_sec.toFixed(1)}s` : "—" },
            { label: "Render",  value: job.render_time_ms ? `${(job.render_time_ms/1000).toFixed(1)}s` : "—" },
          ].map(({ label, value }) => (
            <div key={label} className="bg-ink border border-border rounded-lg p-3">
              <div className="font-mono text-[10px] text-muted uppercase tracking-[0.08em] mb-1">{label}</div>
              <div className="text-[14px] font-semibold text-bright">{value}</div>
            </div>
          ))}
        </div>

        {/* Topic */}
        <div className="bg-ink border border-border rounded-lg p-3">
          <div className="font-mono text-[10px] text-muted uppercase tracking-[0.08em] mb-1">Topic</div>
          <div className="text-[13px] text-bright">{job.topic}</div>
        </div>

        {/* Output */}
        {job.status === "completed" && (
          <div className="flex items-center justify-between bg-emerald/[0.04] border border-emerald/20 rounded-lg p-3.5">
            <div>
              <div className="text-[13px] font-semibold text-emerald mb-1">✅ Video ready</div>
              <div className="font-mono text-[11px] text-muted">{job.output_path || "output available"}</div>
            </div>
            <button className="px-3 py-1.5 border border-emerald/30 text-emerald text-[12px] font-semibold rounded-lg hover:bg-emerald/[0.06] transition-colors">⬇ Download</button>
          </div>
        )}

        {/* Error */}
        {job.error_message && (
          <div className="bg-danger/[0.04] border border-danger/20 rounded-lg p-3.5">
            <div className="font-mono text-[12px] text-danger">❌ {job.error_message}</div>
          </div>
        )}

        {/* QA */}
        {job.qa_passed !== null && (
          <div className="bg-ink border border-border rounded-lg p-3">
            <div className="font-mono text-[10px] text-muted uppercase tracking-[0.08em] mb-1">QA Result</div>
            <div className={`text-[13px] font-semibold ${job.qa_passed ? "text-emerald" : "text-danger"}`}>
              {job.qa_passed ? "✓ All 7 checks passed" : "✗ QA failed — auto-retry triggered"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function JobsPage() {
  const [jobs,      setJobs]     = useState<Job[]>(MOCK);
  const [filter,    setFilter]   = useState("all");
  const [search,    setSearch]   = useState("");
  const [activeJob, setActiveJob]= useState<Job | null>(null);

  // Poll active jobs
  const poll = useCallback(async () => {
    const live = jobs.filter(j =>
      ["queued","generating_hooks","processing","composing","qa_check"].includes(j.status)
    );
    for (const job of live) {
      try {
        const updated = await api.status(job.job_id);
        setJobs(prev => prev.map(j => j.job_id === updated.job_id ? { ...j, ...updated } : j));
      } catch {}
    }
  }, [jobs]);

  useEffect(() => {
    const id = setInterval(poll, 3000);
    return () => clearInterval(id);
  }, [poll]);

  const filtered = jobs.filter(j => {
    if (filter !== "all" && j.status !== filter) return false;
    if (search && !j.topic?.toLowerCase().includes(search.toLowerCase()) && !j.job_id.includes(search)) return false;
    return true;
  });

  const ageStr = (iso: string) => {
    const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
    return mins < 60 ? `${mins}m ago` : `${Math.round(mins/60)}h ago`;
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-[28px] tracking-[0.04em] text-snow leading-none">Jobs</h1>
          <div className="font-mono text-[11px] text-muted mt-1">// {jobs.length} total · {jobs.filter(j => ["processing","composing"].includes(j.status)).length} active</div>
        </div>
        <div className="flex items-center gap-3">
          {/* Search */}
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search jobs..." className="w-52 bg-ink border border-border2 rounded-lg px-3 py-2 text-[13px] text-snow outline-none focus:border-cyan transition-colors placeholder-muted"
          />
          {/* Filter */}
          <select value={filter} onChange={e => setFilter(e.target.value)}
            className="bg-ink border border-border2 rounded-lg px-3 py-2 text-[13px] text-txt outline-none cursor-pointer">
            <option value="all">All status</option>
            {Object.entries(STATUS_CFG).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-5 gap-3">
        {[
          { label: "Total",     value: jobs.length,                                    color: "text-cyan" },
          { label: "Completed", value: jobs.filter(j => j.status === "completed").length, color: "text-emerald" },
          { label: "Active",    value: jobs.filter(j => ["processing","composing","qa_check"].includes(j.status)).length, color: "text-bright" },
          { label: "Failed",    value: jobs.filter(j => j.status === "failed").length, color: "text-danger" },
          { label: "QA Rate",   value: `${(jobs.filter(j=>j.qa_passed).length/Math.max(jobs.filter(j=>j.qa_passed!==null).length,1)*100).toFixed(0)}%`, color: "text-emerald" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-ink2 border border-border rounded-xl p-4">
            <div className="font-mono text-[10px] text-muted uppercase tracking-[0.08em] mb-1">{label}</div>
            <div className={`font-display text-[32px] tracking-tight ${color} leading-none`}>{value}</div>
          </div>
        ))}
      </div>

      {/* Jobs table */}
      <div className="bg-ink2 border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-border bg-ink/50">
                {["Job ID","Topic","Brand","LLM","Duration","Age","Status",""].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-mono text-[10px] tracking-[0.1em] text-muted uppercase font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filtered.map(job => {
                const isLive = ["generating_hooks","processing","composing","qa_check"].includes(job.status);
                const cfg    = STATUS_CFG[job.status] || STATUS_CFG.queued;
                const isActive = activeJob?.job_id === job.job_id;
                return (
                  <tr key={job.job_id} onClick={() => setActiveJob(isActive ? null : job)}
                    className={`cursor-pointer hover:bg-snow/[0.01] transition-colors ${isActive ? "bg-cyan/[0.02]" : ""}`}>
                    <td className="px-4 py-3">
                      <span className="font-mono text-[11px]" style={{ color: isActive ? "#00D4FF" : "#4A6080" }}>
                        {isLive && <span className="text-cyan mr-1.5">●</span>}
                        {job.job_id}
                      </span>
                    </td>
                    <td className="px-4 py-3 max-w-[180px]">
                      <div className="text-[13px] font-semibold text-bright truncate">{job.topic}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[11px] px-2.5 py-1 rounded-full font-semibold border"
                        style={{ color: BRAND_COL[job.brand] || "#8AA0BC", borderColor: `${BRAND_COL[job.brand] || "#8AA0BC"}44`, background: `${BRAND_COL[job.brand] || "#8AA0BC"}10` }}>
                        {job.brand}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-[11px] px-2 py-0.5 rounded border"
                        style={{ color: job.llm_used === "claude" ? "#00D4FF" : job.llm_used === "gpt-4o" ? "#F59E0B" : "#8AA0BC", borderColor: "#1E2A3D", background: "rgba(30,42,58,0.5)" }}>
                        {job.llm_used || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {job.duration_sec ? (
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-1.5 bg-border rounded-full overflow-hidden">
                            <div className="h-full rounded-full bg-gradient-to-r from-emerald to-cyan" style={{ width: `${Math.min((job.duration_sec/30)*100, 100)}%` }} />
                          </div>
                          <span className="font-mono text-[11px] text-muted">{job.duration_sec.toFixed(1)}s</span>
                        </div>
                      ) : <span className="font-mono text-[11px] text-muted">—</span>}
                    </td>
                    <td className="px-4 py-3"><span className="font-mono text-[11px] text-muted">{ageStr(job.created_at)}</span></td>
                    <td className="px-4 py-3">
                      <span className="text-[11px] px-2 py-1 rounded font-mono font-semibold border"
                        style={{ color: cfg.color, background: cfg.bg, borderColor: `${cfg.color}33` }}>
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {job.status === "completed" && (
                        <button className="text-[11px] text-cyan hover:text-bright font-semibold transition-colors">⬇</button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-12 text-center font-mono text-[12px] text-muted">No jobs found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Job detail */}
      {activeJob && <JobDetail job={activeJob} onClose={() => setActiveJob(null)} />}
    </div>
  );
}

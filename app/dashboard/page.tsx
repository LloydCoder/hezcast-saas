"use client";
import { useState, useEffect, useCallback } from "react";
import { api, type Job, type HookVariant } from "@/lib/api";

const BRANDS    = ["GiftMode", "Tinlance", "WebTemify", "HezCast"];
const BRAND_COL: Record<string, string> = { GiftMode: "#FF6B9D", Tinlance: "#00D4FF", WebTemify: "#7C3AED", HezCast: "#00D4FF" };
const STAGE_ORDER = ["queued","generating_hooks","awaiting_selection","processing","composing","qa_check","completed"];
const PIPELINE_STAGES = [
  { key: "generating_hooks", label: "Script",  icon: "✍️" },
  { key: "processing",       label: "Voice",   icon: "🎙️" },
  { key: "composing",        label: "Compose", icon: "🎬" },
  { key: "qa_check",         label: "QA",      icon: "🔍" },
  { key: "completed",        label: "Done",    icon: "✅" },
];

function PipelineTracker({ status }: { status: string }) {
  const idx = STAGE_ORDER.indexOf(status);
  return (
    <div className="flex items-center gap-0">
      {PIPELINE_STAGES.map((s, i) => {
        const sIdx  = STAGE_ORDER.indexOf(s.key);
        const done  = idx > sIdx || status === "completed";
        const active= STAGE_ORDER[idx] === s.key;
        const c     = done ? "#10B981" : active ? "#00D4FF" : "#1E2A3D";
        return (
          <div key={s.key} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-[11px] transition-all"
                style={{ borderColor: c, background: done ? "rgba(16,185,129,0.1)" : active ? "rgba(0,212,255,0.1)" : "transparent", color: c }}>
                {done ? "✓" : s.icon}
              </div>
              <span className="text-[9px] font-mono tracking-[0.08em]" style={{ color: active ? "#00D4FF" : done ? "#10B981" : "#2E4060" }}>{s.label}</span>
            </div>
            {i < PIPELINE_STAGES.length - 1 && <div className="w-6 h-px mb-4 mx-1 transition-all" style={{ background: done ? "#10B981" : "#1A2333" }} />}
          </div>
        );
      })}
    </div>
  );
}

function HookCard({ hook, selected, onSelect }: { hook: HookVariant; selected: boolean; onSelect: () => void }) {
  return (
    <div onClick={onSelect} className={`relative rounded-xl p-3.5 cursor-pointer transition-all border ${selected ? "border-cyan bg-cyan/[0.04] shadow-[0_0_16px_rgba(0,212,255,0.1)]" : "border-border bg-ink hover:border-border2"}`}>
      <div className="font-mono text-[9px] tracking-[0.1em] mb-2" style={{ color: selected ? "#00D4FF" : "#2E4060" }}>
        VARIANT {String(hook.variant_num).padStart(2,"0")}
      </div>
      <div className="text-[12px] leading-relaxed" style={{ color: selected ? "#EDF4FF" : "#8AA0BC" }}>{hook.hook_text}</div>
      {selected && <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-cyan flex items-center justify-center text-[9px] font-bold text-ink">✓</div>}
    </div>
  );
}

export default function GeneratePage() {
  const [topic,    setTopic]   = useState("");
  const [url,      setUrl]     = useState("");
  const [brand,    setBrand]   = useState("GiftMode");
  const [tone,     setTone]    = useState("");
  const [mode,     setMode]    = useState<"topic"|"url">("topic");
  const [loading,  setLoading] = useState(false);
  const [jobs,     setJobs]    = useState<Job[]>([]);
  const [hooks,    setHooks]   = useState<Record<string, HookVariant[]>>({});
  const [selected, setSelected]= useState<Record<string, number>>({});
  const [toast,    setToast]   = useState<string|null>(null);

  const notify = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 4000); };

  // Poll active jobs
  const pollJobs = useCallback(async () => {
    const active = jobs.filter(j => ["queued","generating_hooks","processing","composing","qa_check"].includes(j.status));
    for (const job of active) {
      try {
        const updated = await api.status(job.job_id);
        setJobs(prev => prev.map(j => j.job_id === updated.job_id ? { ...j, ...updated } : j));
        if (updated.status === "completed" && job.status !== "completed") {
          notify(`✅ ${job.brand} video ready — ${job.job_id}`);
        }
        if (updated.status === "awaiting_selection" && !hooks[job.job_id]) {
          const h = await api.hooks(job.job_id).catch(() => []);
          if (h.length) setHooks(prev => ({ ...prev, [job.job_id]: h }));
        }
      } catch {}
    }
  }, [jobs, hooks]);

  useEffect(() => {
    const id = setInterval(pollJobs, 3000);
    return () => clearInterval(id);
  }, [pollJobs]);

  const submit = async () => {
    const t = mode === "topic" ? topic.trim() : "";
    const u = mode === "url"   ? url.trim()   : "";
    if (!t && !u) return;
    setLoading(true);
    try {
      const res = await api.generate({ topic: t || undefined, url: u || undefined, brand, tone: tone || undefined });
      const newJob: Job = { job_id: res.job_id, brand, topic: t || u, status: "queued", duration_sec: null, render_time_ms: null, qa_passed: null, llm_used: null, output_path: null, output_url: null, error_message: null, thumbnail_paths: null, created_at: new Date().toISOString(), completed_at: null };
      setJobs(prev => [newJob, ...prev]);
      notify(`⚡ Job submitted — ${res.job_id}`);
      if (mode === "topic") setTopic(""); else setUrl("");
    } catch (e: unknown) {
      notify(`❌ ${e instanceof Error ? e.message : "Request failed"}`);
    } finally { setLoading(false); }
  };

  const selectHook = async (jobId: string, variantNum: number) => {
    setSelected(prev => ({ ...prev, [jobId]: variantNum }));
    try {
      await api.selectHook(jobId, variantNum);
      setJobs(prev => prev.map(j => j.job_id === jobId ? { ...j, status: "processing" } : j));
      notify(`🔄 Rendering hook ${variantNum}...`);
    } catch {}
  };

  const inputCls = "w-full bg-ink border border-border2 rounded-lg px-3.5 py-2.5 text-[13px] text-snow font-body outline-none focus:border-cyan focus:shadow-[0_0_0_3px_rgba(0,212,255,0.08)] transition-all placeholder-muted";
  const selectCls = inputCls + " cursor-pointer appearance-none";

  return (
    <div className="flex flex-col gap-6">
      {/* Toast */}
      {toast && (
        <div className="fixed top-16 right-5 z-50 bg-ink3 border border-border2 rounded-lg px-4 py-2.5 font-mono text-[12px] text-cyan shadow-xl animate-slide-in">{toast}</div>
      )}

      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-[28px] tracking-[0.04em] text-snow leading-none">Generate <span className="text-cyan">⚡</span></h1>
          <div className="font-mono text-[11px] text-muted mt-1">// POST /generate → script → voice → video</div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3.5">
        {[
          { label: "Total Jobs",    value: jobs.length,                     color: "text-cyan" },
          { label: "Active",        value: jobs.filter(j => ["processing","composing","qa_check"].includes(j.status)).length, color: "text-bright" },
          { label: "Completed",     value: jobs.filter(j => j.status === "completed").length, color: "text-emerald" },
          { label: "QA Pass Rate",  value: `${(jobs.filter(j=>j.qa_passed).length / Math.max(jobs.filter(j=>j.qa_passed!==null).length,1)*100).toFixed(0)}%`, color: "text-emerald" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-ink2 border border-border rounded-xl p-5 relative overflow-hidden">
            <div className="font-mono text-[10px] tracking-[0.1em] text-muted uppercase mb-2">{label}</div>
            <div className={`font-display text-[38px] tracking-tight ${color} leading-none`}>{value}</div>
          </div>
        ))}
      </div>

      {/* Generate panel */}
      <div className="bg-ink2 border border-border rounded-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2 text-[13px] font-bold text-bright">
            <span className="w-2 h-2 rounded-full bg-cyan animate-pulse-dot" style={{ boxShadow: "0 0 6px #00D4FF" }} />
            New Generation Job
          </div>
          <div className="flex gap-2">
            {(["topic","url"] as const).map(m => (
              <button key={m} onClick={() => setMode(m)} className={`px-3 py-1.5 rounded-md text-[12px] font-semibold border transition-all ${mode === m ? "border-cyan text-cyan bg-cyan/[0.06]" : "border-border2 text-dim hover:text-bright"}`}>
                {m === "topic" ? "Topic" : "URL →"}
              </button>
            ))}
          </div>
        </div>
        <div className="p-5">
          {/* LLM chain indicator */}
          <div className="flex items-center gap-2 bg-ink border border-border rounded-lg px-3.5 py-2.5 mb-4">
            <span className="font-mono text-[10px] text-muted uppercase tracking-[0.1em]">LLM Chain:</span>
            {[["Claude Sonnet","primary"],["GPT-4o","standby"],["Ollama","standby"]].map(([name], i) => (
              <div key={name} className="flex items-center gap-1.5">
                <span className={`text-[11px] px-2 py-0.5 rounded font-mono font-semibold border ${i === 0 ? "text-cyan border-cyan/30 bg-cyan/[0.06]" : "text-muted border-border bg-ink3"}`}>
                  {i === 0 && "● "}{name}
                </span>
                {i < 2 && <span className="text-muted text-[10px]">→</span>}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-[1fr_152px_152px] gap-3 mb-4">
            <div>
              <div className="font-mono text-[10px] tracking-[0.1em] text-muted uppercase mb-1.5">{mode === "topic" ? "Topic / Scenario" : "Article / Blog URL"}</div>
              <input className={inputCls} value={mode === "topic" ? topic : url} onChange={e => mode === "topic" ? setTopic(e.target.value) : setUrl(e.target.value)} onKeyDown={e => e.key === "Enter" && submit()} placeholder={mode === "topic" ? "e.g. forgot birthday gift last minute..." : "https://yourblog.com/article..."} />
            </div>
            <div>
              <div className="font-mono text-[10px] tracking-[0.1em] text-muted uppercase mb-1.5">Brand</div>
              <select className={selectCls} value={brand} onChange={e => setBrand(e.target.value)}>
                {BRANDS.map(b => <option key={b} style={{ background: "#0A0D14" }}>{b}</option>)}
              </select>
            </div>
            <div>
              <div className="font-mono text-[10px] tracking-[0.1em] text-muted uppercase mb-1.5">Tone</div>
              <select className={selectCls} value={tone} onChange={e => setTone(e.target.value)}>
                <option value="" style={{ background: "#0A0D14" }}>Brand Default</option>
                {["emotional","authority","developer_energy","founder_energy","urgent"].map(t => <option key={t} style={{ background: "#0A0D14" }}>{t}</option>)}
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-3 border-t border-border">
            <button onClick={submit} disabled={loading || (!topic.trim() && !url.trim())} className="flex items-center gap-2 px-5 py-2.5 bg-cyan rounded-lg text-[13px] font-bold text-ink disabled:opacity-50 hover:bg-cyan/90 hover:shadow-[0_0_20px_rgba(0,212,255,0.25)] transition-all">
              {loading ? "⏳ Submitting..." : "⚡ Generate Video"}
            </button>
          </div>
        </div>
      </div>

      {/* Active jobs with hook selection */}
      {jobs.filter(j => j.status === "awaiting_selection" && hooks[j.job_id]).map(job => (
        <div key={job.job_id} className="bg-ink2 border border-violet/30 rounded-xl">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div className="flex items-center gap-2 text-[13px] font-bold text-bright">
              <span className="w-2 h-2 rounded-full bg-violet animate-pulse-dot" style={{ boxShadow: "0 0 6px #7C3AED" }} />
              Hook Variants Ready — Select to Render
            </div>
            <span className="font-mono text-[11px] text-muted">{job.job_id}</span>
          </div>
          <div className="p-4 grid gap-2.5" style={{ gridTemplateColumns: `repeat(${hooks[job.job_id].length}, 1fr)` }}>
            {hooks[job.job_id].map(h => (
              <HookCard key={h.variant_num} hook={h} selected={selected[job.job_id] === h.variant_num} onSelect={() => selectHook(job.job_id, h.variant_num)} />
            ))}
          </div>
        </div>
      ))}

      {/* Jobs list */}
      {jobs.length > 0 && (
        <div className="bg-ink2 border border-border rounded-xl">
          <div className="px-5 py-4 border-b border-border">
            <div className="text-[13px] font-bold text-bright">Recent Jobs</div>
          </div>
          <div className="divide-y divide-border/40">
            {jobs.slice(0, 10).map(job => {
              const isLive = ["generating_hooks","processing","composing","qa_check"].includes(job.status);
              const statusCfg: Record<string, [string,string]> = {
                queued:             ["#4A6080","rgba(74,96,128,0.12)"],
                generating_hooks:   ["#F59E0B","rgba(245,158,11,0.12)"],
                awaiting_selection: ["#7C3AED","rgba(124,58,237,0.12)"],
                processing:         ["#00D4FF","rgba(0,212,255,0.12)"],
                composing:          ["#00D4FF","rgba(0,212,255,0.12)"],
                qa_check:           ["#F59E0B","rgba(245,158,11,0.12)"],
                completed:          ["#10B981","rgba(16,185,129,0.12)"],
                failed:             ["#EF4444","rgba(239,68,68,0.12)"],
                needs_review:       ["#F59E0B","rgba(245,158,11,0.12)"],
              };
              const [sc, sb] = statusCfg[job.status] || ["#4A6080","transparent"];
              return (
                <div key={job.job_id} className="px-5 py-4 flex items-center gap-4 hover:bg-snow/[0.01] transition-colors">
                  {isLive && <span className="w-1.5 h-1.5 rounded-full bg-cyan flex-shrink-0 animate-pulse-dot" style={{ boxShadow: "0 0 6px #00D4FF" }} />}
                  <span className="font-mono text-[11px] text-muted w-24 flex-shrink-0">{job.job_id}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold text-bright truncate">{job.topic || "—"}</div>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold border flex-shrink-0"
                    style={{ color: BRAND_COL[job.brand] || "#8AA0BC", borderColor: `${BRAND_COL[job.brand]}44`, background: `${BRAND_COL[job.brand]}10` }}>
                    {job.brand}
                  </span>
                  {job.status === "awaiting_selection" && (
                    <div className="flex-shrink-0">
                      <PipelineTracker status={job.status} />
                    </div>
                  )}
                  <span className="text-[11px] px-2 py-1 rounded font-mono font-semibold flex-shrink-0"
                    style={{ color: sc, background: sb, border: `1px solid ${sc}33` }}>
                    {job.status.replace(/_/g," ")}
                  </span>
                  {job.status === "completed" && job.output_path && (
                    <a href={job.output_path} className="text-[12px] text-cyan hover:text-bright no-underline font-semibold flex-shrink-0">⬇ Download</a>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

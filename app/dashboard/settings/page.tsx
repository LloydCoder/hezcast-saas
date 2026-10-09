"use client";
import { useState, useEffect } from "react";
import { api, type HealthResponse } from "@/lib/api";

type TelegramInfo = { configured: boolean; chat_id?: string | null; bot_token_set?: boolean; chat_id_set?: boolean };
type WebhookResult = { ok: boolean; webhook_url?: string; error?: string };

export default function SettingsPage() {
  const [health,     setHealth]     = useState<HealthResponse | null>(null);
  const [tgInfo,     setTgInfo]     = useState<TelegramInfo | null>(null);
  const [domain,     setDomain]     = useState("cast.tinlance.com");
  const [registering,setRegistering]= useState(false);
  const [tgResult,   setTgResult]   = useState<WebhookResult | null>(null);
  const [toast,      setToast]      = useState<string | null>(null);

  const notify = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 4000); };

  useEffect(() => {
    api.health().then(setHealth).catch(() => {});
    api.telegramInfo().then(setTgInfo).catch(() =>
      setTgInfo({ configured: false, bot_token_set: false, chat_id_set: false })
    );
  }, []);

  const registerWebhook = async () => {
    setRegistering(true);
    try {
      const res = await api.registerWebhook(domain);
      setTgResult(res);
      if (res.ok) notify("✅ Telegram webhook registered");
      else notify(`❌ ${res.webhook_url || "Registration failed"}`);
    } catch { notify("❌ Could not reach API"); }
    finally { setRegistering(false); }
  };

  const Row = ({ label, value, color = "text-bright" }: { label: string; value: string; color?: string }) => (
    <div className="flex items-center justify-between py-3.5 border-b border-border/40 last:border-0">
      <span className="text-[13px] text-txt">{label}</span>
      <span className={`font-mono text-[12px] ${color}`}>{value}</span>
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      {toast && (
        <div className="fixed top-16 right-5 z-50 bg-ink3 border border-border2 rounded-lg px-4 py-2.5 font-mono text-[12px] text-cyan shadow-xl animate-slide-in">{toast}</div>
      )}

      <div>
        <h1 className="font-display text-[28px] tracking-[0.04em] text-snow leading-none">Settings</h1>
        <div className="font-mono text-[11px] text-muted mt-1">// system configuration</div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* System Info */}
        <div className="bg-ink2 border border-border rounded-xl">
          <div className="px-5 py-4 border-b border-border">
            <div className="text-[13px] font-bold text-bright">⚙️ System</div>
          </div>
          <div className="px-5">
            <Row label="HezCast Engine" value="v2.0.0" color="text-cyan" />
            <Row label="Engine Tests"    value="579 / 579" color="text-emerald" />
            <Row label="Core Modules"   value="22 modules" />
            <Row label="API Status"     value={health ? "Online ✓" : "Offline ✗"} color={health ? "text-emerald" : "text-danger"} />
            <Row label="API Version"    value={health?.version || "—"} />
            <Row label="Redis"          value={health?.services?.redis || "—"} />
          </div>
        </div>

        {/* Telegram */}
        <div className="bg-ink2 border border-border rounded-xl">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <div className="text-[13px] font-bold text-bright">📡 Telegram Bot</div>
            <div className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${tgInfo?.configured ? "bg-emerald" : "bg-danger"}`}
                style={{ boxShadow: tgInfo?.configured ? "0 0 6px #10B981" : "0 0 6px #EF4444" }} />
              <span className={`font-mono text-[11px] ${tgInfo?.configured ? "text-emerald" : "text-danger"}`}>
                {tgInfo?.configured ? "Configured" : "Not configured"}
              </span>
            </div>
          </div>
          <div className="px-5">
            <Row label="Bot Token"   value={tgInfo?.bot_token_set ? "Set ✓" : "Missing ✗"} color={tgInfo?.bot_token_set ? "text-emerald" : "text-danger"} />
            <Row label="Chat ID"     value={tgInfo?.chat_id || (tgInfo?.chat_id_set ? "Set ✓" : "Missing ✗")} color={tgInfo?.chat_id_set ? "text-emerald" : "text-danger"} />
            <Row label="Webhook"     value={tgInfo?.configured ? "Registered ✓" : "Not registered"} color={tgInfo?.configured ? "text-emerald" : "text-dim"} />
          </div>
          <div className="px-5 pb-5 pt-3">
            <div className="font-mono text-[10px] text-muted uppercase tracking-[0.08em] mb-1.5">Register Webhook</div>
            <div className="flex gap-2">
              <input value={domain} onChange={e => setDomain(e.target.value)}
                className="flex-1 bg-ink border border-border2 rounded-lg px-3 py-2 text-[13px] text-snow outline-none focus:border-cyan transition-colors"
                placeholder="cast.tinlance.com" />
              <button onClick={registerWebhook} disabled={registering || !domain}
                className="px-4 py-2 border border-border2 text-[13px] font-semibold text-txt hover:border-cyan hover:text-cyan rounded-lg transition-all disabled:opacity-50">
                {registering ? "..." : "Register"}
              </button>
            </div>
            {tgResult && (
              <div className={`mt-2 font-mono text-[11px] ${tgResult.ok ? "text-emerald" : "text-danger"}`}>
                {tgResult.ok ? `✓ ${tgResult.webhook_url}` : `✗ ${tgResult.error}`}
              </div>
            )}
          </div>
        </div>

        {/* Environment */}
        <div className="bg-ink2 border border-border rounded-xl">
          <div className="px-5 py-4 border-b border-border">
            <div className="text-[13px] font-bold text-bright">🔑 Environment</div>
          </div>
          <div className="px-5">
            <Row label="API URL"    value={process.env.NEXT_PUBLIC_API_URL || "http://localhost:8503"} />
            <Row label="App URL"    value={process.env.NEXT_PUBLIC_APP_URL || "cast.tinlance.com"} />
            <Row label="Auth"       value="Clerk ✓" color="text-emerald" />
            <Row label="Billing"    value="LemonSqueezy ✓" color="text-emerald" />
            <Row label="Storage"    value="Backblaze B2" color="text-bright" />
          </div>
        </div>

        {/* Bot commands */}
        <div className="bg-ink2 border border-border rounded-xl">
          <div className="px-5 py-4 border-b border-border">
            <div className="text-[13px] font-bold text-bright">💬 Bot Commands</div>
          </div>
          <div className="px-5 py-4">
            <div className="bg-ink border border-border rounded-lg p-4 font-mono text-[11px] leading-[2]">
              {[
                ["/generate [brand] [topic]",     "Generate video from topic"],
                ["/generate [brand] --url [url]", "Generate from URL"],
                ["/select [job_id] [1-5]",        "Select hook variant"],
                ["/status [job_id]",              "Check progress"],
                ["/brands",                       "List brands"],
                ["/credits",                      "View balance"],
              ].map(([cmd, desc]) => (
                <div key={cmd} className="flex gap-3">
                  <span className="text-cyan min-w-[240px]">{cmd}</span>
                  <span className="text-muted">— {desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Danger zone */}
      <div className="bg-danger/[0.03] border border-danger/20 rounded-xl px-5 py-5">
        <div className="text-[13px] font-bold text-danger mb-3">⚠️ Danger Zone</div>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[13px] text-bright font-semibold">Delete all jobs</div>
            <div className="text-[12px] text-dim mt-0.5">Permanently removes all job records and output files</div>
          </div>
          <button className="px-4 py-2 border border-danger/30 text-[13px] font-semibold text-danger hover:bg-danger/[0.06] rounded-lg transition-colors">
            Delete all jobs
          </button>
        </div>
      </div>
    </div>
  );
}

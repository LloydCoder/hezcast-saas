"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { api, type BalanceResponse } from "@/lib/api";

const PLANS = [
  { id: "free",    name: "Free",    price: "$0",    credits: 3,   color: "#4A6080" },
  { id: "starter", name: "Starter", price: "$19/mo", credits: 15,  color: "#8AA0BC" },
  { id: "pro",     name: "Pro",     price: "$49/mo", credits: 60,  color: "#00D4FF" },
  { id: "agency",  name: "Agency",  price: "$149/mo",credits: 300, color: "#10B981" },
];

const TOPUP = [
  { id: "credits_50",  label: "50 Credits",  price: "$45",  per: "$0.90/video" },
  { id: "credits_100", label: "100 Credits", price: "$80",  per: "$0.80/video", best: true },
];

export default function BillingPage() {
  const [balance,   setBalance]  = useState<BalanceResponse | null>(null);
  const [loading,   setLoading]  = useState(true);
  const [topupping, setTopupping]= useState<string | null>(null);
  const [toast,     setToast]    = useState<string | null>(null);

  const notify = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 4000); };

  useEffect(() => {
    api.balance()
      .then(setBalance)
      .catch(() => setBalance({ credits: 47, plan: "pro", plan_name: "Pro", monthly_alloc: 60 }))
      .finally(() => setLoading(false));
  }, []);

  const handleTopup = async (pkg: string) => {
    setTopupping(pkg);
    try {
      const res = await api.topup(pkg);
      window.open(res.checkout_url, "_blank");
    } catch {
      notify("❌ Could not create checkout. Check API connection.");
    } finally { setTopupping(null); }
  };

  const currentPlan = PLANS.find(p => p.id === balance?.plan) || PLANS[2];
  const usedPct     = balance ? Math.round(((balance.monthly_alloc - balance.credits) / balance.monthly_alloc) * 100) : 0;

  return (
    <div className="flex flex-col gap-6">
      {toast && (
        <div className="fixed top-16 right-5 z-50 bg-ink3 border border-border2 rounded-lg px-4 py-2.5 font-mono text-[12px] text-cyan shadow-xl animate-slide-in">{toast}</div>
      )}

      {/* Header */}
      <div>
        <h1 className="font-display text-[28px] tracking-[0.04em] text-snow leading-none">Billing</h1>
        <div className="font-mono text-[11px] text-muted mt-1">// credits + plan management</div>
      </div>

      {loading ? (
        <div className="font-mono text-[12px] text-muted animate-pulse">Loading balance...</div>
      ) : balance && (
        <>
          {/* Current balance + plan */}
          <div className="grid grid-cols-3 gap-4">
            {/* Credits card */}
            <div className="bg-ink2 border border-border rounded-xl p-6 col-span-2">
              <div className="font-mono text-[10px] text-muted uppercase tracking-[0.08em] mb-4">Current Credits</div>
              <div className="flex items-end gap-4 mb-5">
                <div className="font-display text-[72px] tracking-tight text-cyan leading-none">{balance.credits}</div>
                <div className="pb-3">
                  <div className="text-[13px] text-txt">of {balance.monthly_alloc} monthly</div>
                  <div className="font-mono text-[11px] text-emerald">{balance.plan_name} plan</div>
                </div>
              </div>
              {/* Usage bar */}
              <div className="mb-2">
                <div className="flex justify-between font-mono text-[10px] text-muted mb-1.5">
                  <span>Used this month</span>
                  <span>{usedPct}%</span>
                </div>
                <div className="h-2 bg-border rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700 bg-gradient-to-r from-cyan to-violet" style={{ width: `${usedPct}%` }} />
                </div>
              </div>
              <div className="flex gap-4 mt-4 font-mono text-[11px]">
                <div className="text-muted">Used: <span className="text-bright">{balance.monthly_alloc - balance.credits}</span></div>
                <div className="text-muted">Remaining: <span className="text-cyan">{balance.credits}</span></div>
                <div className="text-muted">Rollover: <span className="text-amber">60 days</span></div>
              </div>
            </div>

            {/* Plan card */}
            <div className="bg-ink2 border rounded-xl p-6" style={{ borderColor: `${currentPlan.color}44` }}>
              <div className="font-mono text-[10px] text-muted uppercase tracking-[0.08em] mb-3">Current Plan</div>
              <div className="font-display text-[32px] tracking-[0.04em] mb-1" style={{ color: currentPlan.color }}>{currentPlan.name}</div>
              <div className="text-[20px] font-bold text-bright mb-4">{currentPlan.price}</div>
              <div className="space-y-2 mb-6">
                {[
                  { label: "Videos/month", value: `${currentPlan.credits}` },
                  { label: "Brands",       value: currentPlan.id === "agency" ? "Unlimited" : currentPlan.id === "pro" ? "5" : "1" },
                  { label: "API access",   value: currentPlan.id === "pro" || currentPlan.id === "agency" ? "✓" : "—" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between font-mono text-[11px]">
                    <span className="text-muted">{label}</span>
                    <span className="text-bright">{value}</span>
                  </div>
                ))}
              </div>
              <Link href="/pricing" className="block w-full py-2.5 text-center border border-cyan/30 text-[13px] font-semibold text-cyan rounded-lg no-underline hover:bg-cyan/[0.06] transition-colors">
                Upgrade Plan →
              </Link>
            </div>
          </div>

          {/* Topup cards */}
          <div>
            <div className="font-mono text-[10px] text-muted uppercase tracking-[0.08em] mb-3">Buy More Credits</div>
            <div className="grid grid-cols-2 gap-4">
              {TOPUP.map(pkg => (
                <div key={pkg.id} className={`bg-ink2 border rounded-xl p-6 relative ${pkg.best ? "border-cyan shadow-[0_0_24px_rgba(0,212,255,0.08)]" : "border-border"}`}>
                  {pkg.best && (
                    <div className="absolute top-3 right-3 font-mono text-[9px] tracking-[0.1em] text-emerald bg-emerald/10 border border-emerald/25 px-2 py-0.5 rounded">BEST RATE</div>
                  )}
                  <div className="font-display text-[36px] tracking-tight text-snow leading-none mb-1">{pkg.label}</div>
                  <div className="text-[24px] font-bold text-cyan mb-1">{pkg.price}</div>
                  <div className="font-mono text-[11px] text-muted mb-6">{pkg.per}</div>
                  <button onClick={() => handleTopup(pkg.id)} disabled={topupping === pkg.id}
                    className={`w-full py-3 rounded-lg text-[13px] font-bold transition-all ${pkg.best ? "bg-cyan text-ink hover:bg-cyan/90 hover:shadow-[0_0_16px_rgba(0,212,255,0.3)]" : "border border-border2 text-bright hover:border-cyan hover:text-cyan"}`}>
                    {topupping === pkg.id ? "Opening checkout..." : `Buy ${pkg.label} →`}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Plan comparison */}
          <div className="bg-ink2 border border-border rounded-xl">
            <div className="px-5 py-4 border-b border-border">
              <div className="text-[13px] font-bold text-bright">All Plans</div>
            </div>
            <div className="grid grid-cols-4 divide-x divide-border">
              {PLANS.map(plan => (
                <div key={plan.id} className={`p-5 ${plan.id === balance.plan ? "bg-cyan/[0.03]" : ""}`}>
                  <div className="font-display text-[20px] tracking-[0.04em] mb-1" style={{ color: plan.color }}>{plan.name}</div>
                  <div className="text-[16px] font-bold text-bright mb-3">{plan.price}</div>
                  <div className="font-mono text-[11px] text-muted mb-4">{plan.credits} credits/mo</div>
                  {plan.id === balance.plan ? (
                    <div className="text-[12px] font-semibold text-cyan font-mono">Current plan ✓</div>
                  ) : (
                    <Link href={`/pricing#${plan.id}`} className="text-[12px] text-dim hover:text-cyan no-underline transition-colors">
                      {plan.id === "free" ? "Downgrade" : "Upgrade"} →
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

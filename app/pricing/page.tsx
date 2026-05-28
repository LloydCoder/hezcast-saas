"use client";
import { useState } from "react";
import Link from "next/link";

const PLANS = [
  {
    id: "free", name: "Free", tagline: "Try before you commit",
    monthly: 0, annual: 0,
    cta: "Start free →", ctaHref: "/sign-up", ctaStyle: "ghost",
    features: [
      { ok: true,  text: "3 videos per month" },
      { ok: true,  text: "1 brand" },
      { ok: true,  text: "3 hook variants" },
      { ok: true,  text: "Post bundle (all platforms)" },
      { ok: false, text: "No avatar — voice only" },
      { ok: false, text: "HezCast watermark" },
      { ok: false, text: "24-hour video retention" },
    ],
  },
  {
    id: "starter", name: "Starter", tagline: "For solo founders & creators",
    monthly: 19, annual: 190,
    cta: "Get Starter →", ctaHref: "/sign-up?plan=starter", ctaStyle: "ghost",
    features: [
      { ok: true, text: "15 videos per month" },
      { ok: true, text: "1 brand" },
      { ok: true, text: "5 hook variants" },
      { ok: true, text: "Avatar (MuseTalk lip-sync)" },
      { ok: true, text: "No watermark" },
      { ok: true, text: "1 Telegram channel" },
      { ok: true, text: "3 thumbnails per video" },
      { ok: true, text: "37-day video retention" },
    ],
  },
  {
    id: "pro", name: "Pro", tagline: "For multi-brand founders & teams",
    monthly: 49, annual: 490,
    featured: true,
    cta: "Get Pro →", ctaHref: "/sign-up?plan=pro", ctaStyle: "primary",
    features: [
      { ok: true, text: "60 videos per month" },
      { ok: true, text: "5 brands" },
      { ok: true, text: "5 hook variants per brand" },
      { ok: true, text: "Custom persona photo upload" },
      { ok: true, text: "3 Telegram channels" },
      { ok: true, text: "Hook A/B analytics" },
      { ok: true, text: "API access — 1,000 calls/month" },
      { ok: true, text: "97-day video retention" },
    ],
  },
  {
    id: "agency", name: "Agency", tagline: "For studios & multiple clients",
    monthly: 149, annual: 1490,
    cta: "Get Agency →", ctaHref: "/sign-up?plan=agency", ctaStyle: "ghost",
    features: [
      { ok: true, text: "300 videos per month" },
      { ok: true, text: "Unlimited brands" },
      { ok: true, text: "Unlimited Telegram channels" },
      { ok: true, text: "White-label (your logo)" },
      { ok: true, text: "Client workspaces (isolated)" },
      { ok: true, text: "5 team seats included" },
      { ok: true, text: "Unlimited API access" },
      { ok: true, text: "6-month video retention" },
    ],
  },
];

const COMPARISON = [
  ["Videos per month",     "3",    "15",   "60",        "300"],
  ["Brands",               "1",    "1",    "5",         "Unlimited"],
  ["Hook variants",        "3",    "5",    "5",         "5"],
  ["Avatar",               false,  true,   true,        true],
  ["Thumbnails per video", false,  "3",    "3",         "3"],
  ["Telegram channels",    "1",    "1",    "3",         "Unlimited"],
  ["Post bundle",          true,   true,   true,        true],
  ["URL-to-video",         true,   true,   true,        true],
  ["Hook analytics",       false,  false,  true,        true],
  ["API access",           false,  false,  "1K/mo",     "Unlimited"],
  ["Video retention",      "24h",  "37d",  "97d",       "6 months"],
  ["White-label",          false,  false,  false,       true],
  ["Watermark",            "Yes",  "None", "None",      "None"],
];

export default function PricingPage() {
  const [billing, setBilling] = useState<"monthly"|"annual">("annual");

  const price = (plan: typeof PLANS[0]) =>
    billing === "annual" ? plan.annual : plan.monthly;

  return (
    <div className="min-h-screen bg-ink">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-[68px] flex items-center justify-between px-[6%] bg-ink/90 backdrop-blur-xl border-b border-border">
        <Link href="/" className="flex items-center gap-2.5 no-underline">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan to-violet flex items-center justify-center font-mono font-black text-[15px] text-ink">H</div>
          <span className="font-display text-[22px] tracking-[0.06em] text-snow">Hez<span className="text-cyan">Cast</span></span>
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/" className="text-[13px] text-dim hover:text-bright transition-colors no-underline">Home</Link>
          <Link href="/pricing" className="text-[13px] text-cyan no-underline">Pricing</Link>
          <Link href="/sign-up" className="px-4 py-2 bg-cyan rounded-md text-[13px] font-bold text-ink no-underline">Start free →</Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-36 pb-20 text-center px-[6%] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-radial from-cyan/[0.06] to-transparent rounded-full blur-3xl" />
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 border border-cyan/25 rounded-full bg-cyan/5 font-mono text-[11px] text-cyan tracking-[0.1em] uppercase mb-7">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse-dot" />Simple, transparent pricing
        </div>
        <h1 className="font-display text-[clamp(52px,8vw,96px)] text-snow tracking-[0.03em] leading-[0.95] mb-5 relative">START FREE.<br />SCALE <span className="text-cyan">WITHOUT</span><br />LIMITS.</h1>
        <p className="text-[17px] text-txt max-w-[500px] mx-auto mb-10 leading-relaxed relative">One credit = one video. Credits roll over. No surprises.</p>

        {/* Billing toggle */}
        <div className="inline-flex items-center gap-1 bg-ink3 border border-border2 rounded-lg p-1 mb-16">
          {(["monthly","annual"] as const).map(b => (
            <button key={b} onClick={() => setBilling(b)}
              className={`px-5 py-2 rounded-md text-[13px] font-semibold transition-all ${billing === b ? "bg-cyan text-ink" : "text-dim hover:text-txt"}`}>
              {b.charAt(0).toUpperCase() + b.slice(1)}
              {b === "annual" && <span className="ml-1.5 text-[10px] font-bold text-emerald bg-emerald/10 border border-emerald/25 rounded px-1.5 py-0.5">SAVE 2 MONTHS</span>}
            </button>
          ))}
        </div>
      </section>

      {/* PLAN CARDS */}
      <div className="px-[6%] pb-20 grid grid-cols-4 gap-4 max-w-[1200px] mx-auto">
        {PLANS.map(plan => (
          <div key={plan.id} className={`bg-ink2 border rounded-2xl p-8 flex flex-col relative overflow-hidden transition-all hover:-translate-y-1 ${plan.featured ? "border-cyan shadow-[0_0_40px_rgba(0,212,255,0.08)]" : "border-border hover:border-border2"}`}>
            {plan.featured && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-cyan text-ink font-display text-[11px] tracking-[0.15em] px-4 py-1 rounded-b-lg">MOST POPULAR</div>
            )}
            <div className={`font-display text-[28px] tracking-[0.06em] mb-1.5 ${plan.featured ? "text-cyan mt-4" : "text-snow"}`}>{plan.name}</div>
            <div className="text-[12px] text-dim mb-6">{plan.tagline}</div>

            <div className="flex items-baseline gap-1 mb-1">
              {plan.monthly > 0 && <span className="text-[20px] font-bold text-bright">$</span>}
              <span className={`font-display text-[56px] leading-none tracking-tight ${plan.monthly === 0 ? "text-emerald" : "text-snow"}`}>
                {plan.monthly === 0 ? "$0" : price(plan)}
              </span>
            </div>
            <div className="text-[13px] text-dim mb-1">
              {plan.monthly === 0 ? "forever free" : billing === "annual" ? "per year" : "per month"}
            </div>
            {plan.monthly > 0 && billing === "annual" && (
              <div className="font-mono text-[11px] text-emerald mb-6">${plan.monthly}/month equivalent</div>
            )}
            {plan.monthly > 0 && billing === "monthly" && (
              <div className="font-mono text-[11px] text-emerald mb-6">${plan.annual}/year — 2 months free</div>
            )}
            {plan.monthly === 0 && <div className="mb-6" />}

            <Link href={plan.ctaHref} className={`block w-full py-3 rounded-lg text-[14px] font-bold text-center no-underline mb-6 transition-all ${plan.ctaStyle === "primary" ? "bg-cyan text-ink hover:bg-cyan/90 hover:shadow-[0_0_20px_rgba(0,212,255,0.3)]" : "border border-border2 text-txt hover:border-cyan hover:text-cyan"}`}>
              {plan.cta}
            </Link>
            {plan.monthly > 0 && (
              <div className="text-center mb-5">
                <span className="font-mono text-[10px] text-muted">or </span>
                <a href="https://api.hezcast.com/billing/crypto-topup"
                  className="font-mono text-[10px] text-cyan hover:underline no-underline">
                  pay with USDT/USDC →
                </a>
              </div>
            )}

            <div className="h-px bg-border mb-5" />
            <ul className="flex flex-col gap-3 list-none flex-1">
              {plan.features.map((f, i) => (
                <li key={i} className={`flex items-start gap-2.5 text-[13px] leading-snug ${f.ok ? "text-txt" : "text-dim opacity-50"}`}>
                  <span className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[9px] flex-shrink-0 ${f.ok ? (plan.featured ? "bg-cyan/12 text-cyan" : "bg-emerald/12 text-emerald") : "bg-muted/15 text-muted"}`}>
                    {f.ok ? "✓" : "—"}
                  </span>
                  {f.text}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* COMPARISON TABLE */}
      <div className="px-[6%] pb-20 max-w-[1200px] mx-auto">
        <div className="font-mono text-[10px] tracking-[0.15em] text-cyan uppercase flex items-center gap-2.5 mb-3">
          <span className="w-6 h-px bg-cyan" />Feature breakdown
        </div>
        <h2 className="font-display text-[40px] text-snow tracking-[0.03em] mb-8">EVERYTHING SIDE BY SIDE</h2>
        <div className="bg-ink2 border border-border rounded-xl overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-ink3 border-b border-border">
                <th className="text-left p-4 font-mono text-[10px] tracking-[0.1em] uppercase text-muted">Feature</th>
                {["Free","Starter","Pro ★","Agency"].map((h, i) => (
                  <th key={h} className={`p-4 font-display text-[16px] tracking-[0.06em] ${i === 2 ? "text-cyan" : "text-bright"}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map(([label, ...vals], i) => (
                <tr key={i} className="border-b border-border/40 hover:bg-snow/[0.01] transition-colors">
                  <td className="p-3 px-4 text-[13px] font-medium text-bright">{label}</td>
                  {vals.map((v, j) => (
                    <td key={j} className={`p-3 text-center text-[13px] ${j === 2 ? "font-semibold" : ""}`}>
                      {v === true  ? <span className="text-emerald text-base">✓</span>
                       : v === false ? <span className="text-muted text-base">✗</span>
                       : <span className={j === 2 ? "text-cyan font-semibold" : "text-bright"}>{v}</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>


      {/* CRYPTO TOPUP */}
      <div className="px-[6%] pb-20 max-w-[1200px] mx-auto">
        <div className="bg-ink2 border border-border rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="px-8 py-6 border-b border-border flex items-center justify-between">
            <div>
              <div className="font-mono text-[10px] tracking-[0.15em] text-cyan uppercase flex items-center gap-2 mb-2">
                <span className="w-4 h-px bg-cyan" />Pay with Crypto
              </div>
              <h2 className="font-display text-[28px] text-snow tracking-[0.03em] leading-none">
                BUY CREDITS WITH <span className="text-cyan">STABLECOINS</span>
              </h2>
              <p className="text-[13px] text-dim mt-2">USDT · USDC · DAI — no volatile crypto, no exchange rate risk</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-cyan/[0.06] border border-cyan/20 rounded-full">
              <span className="w-2 h-2 rounded-full bg-cyan animate-pulse" style={{ boxShadow: "0 0 6px #00D4FF" }} />
              <span className="font-mono text-[11px] text-cyan">NOWPayments</span>
            </div>
          </div>

          {/* Cards */}
          <div className="p-8 grid grid-cols-2 gap-6">
            {/* 50 Credits */}
            <div className="bg-ink border border-border rounded-xl p-6">
              <div className="font-display text-[48px] text-snow leading-none tracking-tight mb-1">50</div>
              <div className="font-mono text-[10px] text-muted uppercase tracking-[0.1em] mb-4">Credits</div>
              <div className="text-[32px] font-bold text-cyan mb-1">$45</div>
              <div className="font-mono text-[11px] text-muted mb-6">$0.90 per video</div>
              <div className="flex flex-col gap-2 mb-6">
                {["USDT TRC-20 (lowest fees ~$1)","USDT BEP-20","USDC ERC-20","DAI ERC-20"].map(c => (
                  <div key={c} className="flex items-center gap-2 text-[12px] text-dim">
                    <span className="text-cyan">✓</span> {c}
                  </div>
                ))}
              </div>
              <a href={`${process.env.NEXT_PUBLIC_API_URL || "https://api.hezcast.com"}/billing/crypto-topup`}
                className="block w-full py-3 text-center border border-border2 text-[13px] font-bold text-bright rounded-lg no-underline hover:border-cyan hover:text-cyan transition-all">
                Pay with Crypto →
              </a>
            </div>

            {/* 100 Credits */}
            <div className="bg-ink border border-cyan/20 rounded-xl p-6 relative" style={{ boxShadow: "0 0 24px rgba(0,212,255,0.06)" }}>
              <div className="absolute top-3 right-3 font-mono text-[9px] tracking-[0.1em] text-emerald bg-emerald/10 border border-emerald/25 px-2 py-0.5 rounded">BEST RATE</div>
              <div className="font-display text-[48px] text-snow leading-none tracking-tight mb-1">100</div>
              <div className="font-mono text-[10px] text-muted uppercase tracking-[0.1em] mb-4">Credits</div>
              <div className="text-[32px] font-bold text-cyan mb-1">$80</div>
              <div className="font-mono text-[11px] text-cyan mb-6">$0.80 per video — best rate</div>
              <div className="flex flex-col gap-2 mb-6">
                {["USDT TRC-20 (lowest fees ~$1)","USDT BEP-20","USDC ERC-20","DAI ERC-20"].map(c => (
                  <div key={c} className="flex items-center gap-2 text-[12px] text-dim">
                    <span className="text-cyan">✓</span> {c}
                  </div>
                ))}
              </div>
              <a href={`${process.env.NEXT_PUBLIC_API_URL || "https://api.hezcast.com"}/billing/crypto-topup`}
                className="block w-full py-3 text-center bg-cyan text-[13px] font-bold text-ink rounded-lg no-underline hover:bg-cyan/90 hover:shadow-[0_0_20px_rgba(0,212,255,0.3)] transition-all">
                Pay with Crypto →
              </a>
            </div>
          </div>

          {/* Bottom note */}
          <div className="px-8 py-4 border-t border-border bg-ink/30 flex items-center justify-between">
            <div className="flex items-center gap-6 font-mono text-[11px] text-muted">
              <span>✓ Instant credit activation on confirmation</span>
              <span>✓ No chargebacks</span>
              <span>✓ Stablecoins only — no price volatility</span>
            </div>
            <span className="font-mono text-[10px] text-muted">Powered by NOWPayments</span>
          </div>
        </div>
      </div>
      {/* CTA */}
      <section className="px-[6%] py-20 text-center">
        <h2 className="font-display text-[clamp(40px,6vw,72px)] text-snow tracking-[0.03em] mb-4">3 FREE VIDEOS.<br /><span className="text-cyan">START NOW.</span></h2>
        <p className="text-[15px] text-txt max-w-[380px] mx-auto mb-8 leading-relaxed">No credit card. See what HezCast generates for your brand in 10 minutes.</p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/sign-up" className="inline-flex items-center gap-2 px-7 py-3.5 bg-cyan rounded-lg text-[15px] font-bold text-ink no-underline hover:bg-cyan/90 transition-all">⚡ Start free</Link>
          <Link href="https://github.com/Tinlance/hezcast-engine" className="inline-flex items-center gap-2 px-7 py-3.5 border border-border2 rounded-lg text-[15px] font-semibold text-bright no-underline hover:border-cyan hover:text-cyan transition-all">⭐ Self-host</Link>
        </div>
        <p className="font-mono text-[11px] text-muted mt-4">Free plan · No credit card · Apache 2.0</p>
      </section>

      <footer className="px-[6%] py-6 border-t border-border flex items-center justify-between">
        <span className="font-mono text-[11px] text-muted">© 2026 TINLANCE LIMITED</span>
        <div className="flex gap-6">
          {[["/" ,"Home"],["/privacy","Privacy"],["/terms","Terms"]].map(([href,label])=>(
            <Link key={href} href={href} className="text-[13px] text-dim hover:text-cyan no-underline transition-colors">{label}</Link>
          ))}
        </div>
      </footer>
    </div>
  );
}

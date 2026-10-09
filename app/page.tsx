import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";

type DemoLine =
  | { type: "you" | "bot" | "info" | "hint" | "tag"; text: string; color?: string }
  | { type: "hook"; n: number; text: string; hl: string };

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-ink">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-[68px] flex items-center justify-between px-[6%] bg-ink/90 backdrop-blur-xl border-b border-border">
        <Link href="/" className="flex items-center gap-2.5 no-underline">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan to-violet flex items-center justify-center font-mono font-black text-[15px] text-ink">H</div>
          <span className="font-display text-[22px] tracking-[0.06em] text-snow">Hez<span className="text-cyan">Cast</span></span>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          {[["#how-it-works","How it works"],["#features","Features"],["/pricing","Pricing"],["https://github.com/Tinlance/hezcast-engine","GitHub"]].map(([href, label]) => (
            <Link key={href} href={href} className="text-[13px] font-medium text-dim hover:text-bright transition-colors no-underline">{label}</Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <SignedIn>
            <Link href="/dashboard" className="px-4 py-2 bg-cyan rounded-md text-[13px] font-bold text-ink no-underline hover:bg-cyan/90 transition-colors">Dashboard →</Link>
          </SignedIn>
          <SignedOut>
            <Link href="/sign-in" className="px-4 py-2 border border-border2 rounded-md text-[13px] font-medium text-txt hover:border-cyan hover:text-cyan transition-colors no-underline">Sign in</Link>
            <Link href="/sign-up" className="px-4 py-2 bg-cyan rounded-md text-[13px] font-bold text-ink no-underline hover:bg-cyan/90 transition-colors">Start free →</Link>
          </SignedOut>
        </div>
      </nav>

      {/* HERO */}
      <section className="min-h-screen flex items-center justify-center text-center px-[6%] pt-[120px] pb-20 relative overflow-hidden">
        {/* Grid bg */}
        <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "linear-gradient(#00D4FF 1px, transparent 1px), linear-gradient(90deg, #00D4FF 1px, transparent 1px)", backgroundSize: "60px 60px", maskImage: "radial-gradient(ellipse 80% 60% at 50% 40%, black, transparent 70%)" }} />
        {/* Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-radial from-cyan/[0.07] to-transparent rounded-full blur-3xl" />

        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 border border-cyan/25 rounded-full bg-cyan/5 font-mono text-[11px] text-cyan tracking-[0.1em] uppercase mb-8 animate-fade-up">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse-dot" />
            AI Content Broadcasting System
          </div>

          <h1 className="font-display text-[clamp(64px,10vw,120px)] leading-[0.92] tracking-[0.02em] text-snow mb-2 animate-fade-up" style={{ animationDelay: "0.1s" }}>
            TURN IDEAS INTO<br />
            <span className="text-cyan">BROADCAST</span>
            <span className="text-pink">-READY</span><br />
            CONTENT
          </h1>

          <p className="font-display text-[clamp(24px,4vw,44px)] tracking-[0.08em] text-muted mb-7 animate-fade-up" style={{ animationDelay: "0.15s" }}>
            One prompt. One brand. One complete video.
          </p>

          <p className="text-[17px] text-txt leading-relaxed max-w-[520px] mx-auto mb-12 animate-fade-up" style={{ animationDelay: "0.2s" }}>
            HezCast generates short-form video content — script, voice, visuals, captions, thumbnails, and post bundle — then publishes automatically to your Telegram channel.
          </p>

          <div className="flex items-center justify-center gap-4 mb-16 animate-fade-up" style={{ animationDelay: "0.25s" }}>
            <Link href="/sign-up" className="inline-flex items-center gap-2 px-7 py-3.5 bg-cyan rounded-lg text-[15px] font-bold text-ink no-underline hover:bg-cyan/90 hover:shadow-[0_0_30px_rgba(0,212,255,0.35)] hover:-translate-y-0.5 transition-all">⚡ Start free — 3 videos</Link>
            <Link href="#how-it-works" className="inline-flex items-center gap-2 px-7 py-3.5 border border-border2 rounded-lg text-[15px] font-semibold text-bright no-underline hover:border-cyan hover:text-cyan transition-all">See how →</Link>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-12 animate-fade-up" style={{ animationDelay: "0.3s" }}>
            {[
              { num: "22", label: "Modules Built", color: "text-cyan" },
              { num: "453", label: "Tests Passing", color: "text-snow" },
              { num: "4", label: "Brands", color: "text-pink" },
              { num: "$0", label: "To Start", color: "text-emerald" },
            ].map(({ num, label, color }, i) => (
              <div key={i} className="text-center">
                <div className={`font-display text-[36px] tracking-tight ${color} leading-none`}>{num}</div>
                <div className="font-mono text-[10px] text-dim tracking-[0.1em] uppercase mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TERMINAL DEMO */}
      <section className="px-[6%] pb-24">
        <div className="max-w-3xl mx-auto bg-ink2 border border-border rounded-2xl overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.5),0_0_40px_rgba(0,212,255,0.08)]">
          <div className="h-10 bg-ink3 border-b border-border flex items-center px-4 gap-2">
            <div className="w-3 h-3 rounded-full bg-[#FF5F56]" /><div className="w-3 h-3 rounded-full bg-[#FFBD2E]" /><div className="w-3 h-3 rounded-full bg-[#27C93F]" />
            <span className="flex-1 text-center font-mono text-[11px] text-dim tracking-[0.08em]">HezCast Bot — Telegram</span>
          </div>
          <div className="p-6 font-mono text-[13px] leading-[1.8]">
            {([
              { type: "you",  text: "/generate GiftMode forgot birthday gift last minute" },
              { type: "bot",  text: "⚡ Job started — 4f7a2c1e", color: "text-emerald" },
              { type: "info", text: "Generating 5 hook variants..." },
              { type: "bot",  text: "🎬 Hook variants ready — pick one:", color: "text-emerald" },
              { type: "hook", n: 1, text: "Nobody told me you could forget your mum's birthday", hl: "TWICE" },
              { type: "hook", n: 2, text: "I had 2 hours to find a gift. I was", hl: "absolutely cooked" },
              { type: "hook", n: 3, text: "POV: Her birthday is", hl: "TODAY" },
              { type: "hint", text: "→ /select 4f7a2c1e [1-5]" },
              { type: "you",  text: "/select 4f7a2c1e 2" },
              { type: "bot",  text: "🔄 Rendering hook 2... Script → Voice → Clips → QA", color: "text-amber" },
              { type: "bot",  text: "✅ Video ready! [final.mp4 · 24.3s · 1080×1920]", color: "text-emerald" },
              { type: "tag",  text: "#GiftMode #GiftIdeas #BirthdayGift" },
            ] satisfies DemoLine[]).map((line, i) => (
              <div key={i} className="flex items-baseline gap-2">
                {line.type === "you"  && <><span className="text-cyan flex-shrink-0">you →</span><span className="text-snow">{line.text}</span></>}
                {line.type === "bot"  && <><span className="text-muted flex-shrink-0">bot →</span><span className={line.color}>{line.text}</span></>}
                {line.type === "info" && <span className="text-dim pl-5">{line.text}</span>}
                {line.type === "hook" && <><span className="text-cyan pl-5">{line.n}.</span><span className="text-txt">{line.text} <span className="text-pink font-semibold">{line.hl}...</span></span></>}
                {line.type === "hint" && <span className="text-muted pl-5 italic">{line.text}</span>}
                {line.type === "tag"  && <span className="text-cyan pl-5">{line.text}</span>}
              </div>
            ))}
            <div className="flex items-center gap-2 mt-1">
              <span className="text-cyan">$</span>
              <span className="w-2 h-3.5 bg-cyan animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="px-[6%] py-24">
        <div className="font-mono text-[10px] tracking-[0.15em] text-cyan uppercase flex items-center gap-2.5 mb-3">
          <span className="w-6 h-px bg-cyan" />How it works
        </div>
        <h2 className="font-display text-[clamp(40px,5vw,64px)] text-snow tracking-[0.03em] leading-none mb-4">FROM PROMPT TO <span className="text-cyan">PUBLISHED</span></h2>
        <p className="text-[16px] text-txt leading-relaxed max-w-[500px] mb-14">Eight automated stages turn your topic into a complete content package.</p>

        <div className="grid grid-cols-4 gap-0.5 max-w-4xl">
          {[
            { n: "01", icon: "✍️", name: "Script Engine", desc: "Claude → GPT-4o → Ollama. Hook → Problem → Agitate → Solution → Proof → CTA." },
            { n: "02", icon: "🎙️", name: "Voice Engine",  desc: "Piper TTS with per-brand voice profiles. Maya, Lloyd, Dev, or your custom voice." },
            { n: "03", icon: "🎬", name: "Video Composer",desc: "CLIP semantic clip matching + FFmpeg. 1080×1920 H.264 MP4 with brand overlays." },
            { n: "04", icon: "📦", name: "Content Pack",  desc: "Video + 3 thumbnails + captions + hashtags + platform variants. One bundle." },
          ].map((step, i) => (
            <div key={i} className={`bg-ink2 border border-border p-7 hover:-translate-y-1 hover:bg-ink3 transition-all cursor-default ${i === 0 ? "rounded-l-xl" : i === 3 ? "rounded-r-xl" : ""}`}>
              <div className="font-display text-5xl text-border2 leading-none mb-3">{step.n}</div>
              <div className="text-3xl mb-3">{step.icon}</div>
              <div className="text-[14px] font-bold text-bright mb-2">{step.name}</div>
              <div className="text-[12px] text-dim leading-relaxed">{step.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="px-[6%] py-24">
        <div className="font-mono text-[10px] tracking-[0.15em] text-cyan uppercase flex items-center gap-2.5 mb-3">
          <span className="w-6 h-px bg-cyan" />Everything included
        </div>
        <h2 className="font-display text-[clamp(40px,5vw,64px)] text-snow tracking-[0.03em] leading-none mb-14">NOT A VIDEO TOOL.<br /><span className="text-cyan">CONTENT INFRASTRUCTURE.</span></h2>

        <div className="grid grid-cols-3 gap-5 max-w-4xl">
          {[
            { icon: "🤖", title: "Hybrid LLM Chain",      desc: "Claude primary. GPT-4o fallback. Ollama local as final fallback. Zero downtime." },
            { icon: "🎭", title: "Hook A/B Testing",       desc: "3–5 variants per job. Select before render. Analytics tracks winners." },
            { icon: "🖼️", title: "Thumbnail Engine",       desc: "3 branded variants per video — hook, curiosity, authority. Brand colors + bold type." },
            { icon: "🔍", title: "Semantic Clip Matching", desc: "CLIP + FAISS zero-shot search. No manual clip selection needed." },
            { icon: "✅", title: "7-Point QA Validator",   desc: "Resolution, duration, sync, black frames, subtitles, face, file size. Auto-retry." },
            { icon: "📱", title: "Telegram Bot",           desc: "/generate, /select, /status — full pipeline control from your phone." },
            { icon: "🌐", title: "URL-to-Video",           desc: "Pass any blog URL. HezCast reads it and generates the script automatically." },
            { icon: "💾", title: "Smart Storage",          desc: "Local VPS 7 days. Auto-archive to Backblaze B2. Plan-based retention." },
            { icon: "🔓", title: "Open Core",              desc: "Full engine on GitHub, Apache 2.0. Self-host free. SaaS for teams." },
          ].map((f, i) => (
            <div key={i} className="bg-ink2 border border-border rounded-xl p-7 hover:border-border2 hover:-translate-y-0.5 transition-all">
              <div className="text-[28px] mb-4">{f.icon}</div>
              <div className="text-[15px] font-bold text-bright mb-2">{f.title}</div>
              <div className="text-[13px] text-dim leading-relaxed">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-[6%] py-24 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-radial from-cyan/[0.05] to-transparent" />
        <h2 className="font-display text-[clamp(48px,7vw,80px)] text-snow tracking-[0.03em] leading-none mb-4 relative">READY TO <span className="text-cyan">BROADCAST</span>?</h2>
        <p className="text-[16px] text-txt max-w-[420px] mx-auto mb-10 leading-relaxed relative">Start free. 3 videos. No credit card. See what HezCast generates for your brand.</p>
        <div className="flex items-center justify-center gap-4 relative">
          <Link href="/sign-up" className="inline-flex items-center gap-2 px-7 py-3.5 bg-cyan rounded-lg text-[15px] font-bold text-ink no-underline hover:bg-cyan/90 hover:shadow-[0_0_30px_rgba(0,212,255,0.35)] hover:-translate-y-0.5 transition-all">⚡ Start free</Link>
          <Link href="/pricing" className="inline-flex items-center gap-2 px-7 py-3.5 border border-border2 rounded-lg text-[15px] font-semibold text-bright no-underline hover:border-cyan hover:text-cyan transition-all">See pricing →</Link>
        </div>
        <p className="font-mono text-[11px] text-muted mt-4">Free plan · No credit card · Apache 2.0 open source</p>
      </section>

      {/* FOOTER */}
      <footer className="px-[6%] py-12 border-t border-border grid grid-cols-4 gap-10">
        <div>
          <div className="font-display text-[20px] tracking-[0.06em] text-snow mb-3">Hez<span className="text-cyan">Cast</span></div>
          <p className="text-[13px] text-dim leading-relaxed max-w-[180px]">AI Content Broadcasting System by Tinlance Limited. God strengthens.</p>
        </div>
        {[
          { title: "Product", links: [["#how-it-works","How it works"],["#features","Features"],["/pricing","Pricing"],["https://github.com/Tinlance/hezcast-engine","GitHub"]] },
          { title: "Company", links: [["https://tinlance.com","Tinlance"],["https://giftmode.app","GiftMode"],["https://webtemify.com","WebTemify"],["https://kalevioai.com","KalevioAI"]] },
          { title: "Legal",   links: [["/privacy","Privacy"],["/terms","Terms"],["/license","Apache 2.0"]] },
        ].map(({ title, links }) => (
          <div key={title}>
            <div className="text-[12px] font-bold text-bright tracking-[0.08em] uppercase mb-4">{title}</div>
            <ul className="flex flex-col gap-2.5 list-none">
              {links.map(([href, label]) => (
                <li key={href}><Link href={href} className="text-[13px] text-dim hover:text-cyan transition-colors no-underline">{label}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </footer>
      <div className="px-[6%] py-5 border-t border-border flex items-center justify-between">
        <span className="font-mono text-[11px] text-muted tracking-[0.05em]">© 2026 TINLANCE LIMITED · RC: 7962164</span>
        <span className="font-mono text-[11px] text-muted italic">God strengthens. So does your content.</span>
      </div>
    </div>
  );
}

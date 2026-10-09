"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

const NAV = [
  { href: "/dashboard",           icon: "⚡", label: "Generate" },
  { href: "/dashboard/jobs",      icon: "📋", label: "Jobs" },
  { href: "/dashboard/analytics", icon: "📊", label: "Analytics" },
  { href: "/dashboard/brands",    icon: "🎭", label: "Brands" },
  { href: "/dashboard/billing",   icon: "💳", label: "Billing" },
  { href: "/dashboard/settings",  icon: "⚙️", label: "Settings" },
];

function LiveDot({ online }: { online: boolean }) {
  return (
    <span className={`inline-block w-1.5 h-1.5 rounded-full ${online ? "bg-emerald" : "bg-danger"} animate-pulse-dot`}
      style={{ boxShadow: online ? "0 0 6px #10B981" : "0 0 6px #EF4444" }} />
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const path      = usePathname();
  const [online, setOnline]   = useState(false);
  const [credits, setCredits] = useState<number | null>(null);

  useEffect(() => {
    api.health().then(() => setOnline(true)).catch(() => setOnline(false));
    api.balance().then(b => setCredits(b.credits)).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-ink flex flex-col">
      {/* Topbar */}
      <header className="h-[58px] bg-ink2/95 border-b border-border sticky top-0 z-50 backdrop-blur-xl flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 no-underline">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan to-violet flex items-center justify-center font-mono font-black text-[13px] text-ink">H</div>
            <span className="font-display text-[19px] tracking-[0.06em] text-snow">Hez<span className="text-cyan">Cast</span></span>
          </Link>
          <div className="w-px h-5 bg-border" />
          <span className="font-mono text-[10px] text-muted tracking-[0.08em] uppercase">Dashboard</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <LiveDot online={online} />
            <span className={`font-mono text-[11px] ${online ? "text-emerald" : "text-danger"}`}>
              {online ? "API Online" : "API Offline"}
            </span>
          </div>
          {credits !== null && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-ink3 border border-border2 rounded-full">
              <span className="font-mono text-[12px] text-bright">💳 {credits} credits</span>
            </div>
          )}
          <UserButton afterSignOutUrl="/" appearance={{ variables: { colorPrimary: "#00D4FF" } }} />
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <nav className="w-[220px] bg-ink2 border-r border-border flex flex-col gap-1 py-4 sticky top-[58px] h-[calc(100vh-58px)] overflow-y-auto flex-shrink-0">
          <div className="font-mono text-[9px] tracking-[0.14em] text-muted uppercase px-4 py-1 mb-1">Core</div>
          {NAV.map(item => {
            const active = path === item.href || (item.href !== "/dashboard" && path.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href} className={`flex items-center gap-2.5 px-4 py-2.5 text-[13px] font-medium transition-all no-underline border-r-2 ${active ? "text-cyan bg-cyan/[0.06] border-cyan" : "text-dim hover:text-bright hover:bg-snow/[0.02] border-transparent"}`}>
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
          <div className="mt-auto px-4 pt-4 border-t border-border">
            <div className="font-mono text-[10px] text-muted leading-relaxed">
              <div>HezCast v2.0</div>
              <div className="text-[9px]">by Tinlance Ltd</div>
              <Link href="https://github.com/LloydCoder/hezcast-engine" className="text-muted hover:text-cyan transition-colors no-underline">⭐ GitHub</Link>
            </div>
          </div>
        </nav>

        {/* Main */}
        <main className="flex-1 p-7 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

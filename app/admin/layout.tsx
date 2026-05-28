import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";

// Admin Clerk user IDs — add yours here after first login
const ADMIN_USER_IDS = [
  process.env.ADMIN_CLERK_USER_ID || "",
].filter(Boolean);

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  // Redirect non-admin users
  if (!userId || (ADMIN_USER_IDS.length > 0 && !ADMIN_USER_IDS.includes(userId))) {
    redirect("/dashboard");
  }

  const NAV = [
    { href: "/admin",          label: "Overview" },
    { href: "/admin/tenants",  label: "Tenants" },
    { href: "/admin/jobs",     label: "All Jobs" },
    { href: "/admin/system",   label: "System" },
  ];

  return (
    <div className="min-h-screen bg-ink">
      {/* Admin topbar */}
      <header className="h-[58px] bg-danger/[0.04] border-b border-danger/20 sticky top-0 z-50 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 no-underline">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan to-violet flex items-center justify-center font-mono font-black text-[13px] text-ink">H</div>
            <span className="font-display text-[19px] tracking-[0.06em] text-snow">Hez<span className="text-cyan">Cast</span></span>
          </Link>
          <div className="w-px h-5 bg-border" />
          <span className="font-mono text-[10px] text-danger tracking-[0.08em] uppercase">Admin Panel</span>
        </div>
        <div className="flex items-center gap-6">
          {NAV.map(({ href, label }) => (
            <Link key={href} href={href} className="text-[13px] font-medium text-dim hover:text-bright transition-colors no-underline">{label}</Link>
          ))}
          <Link href="/dashboard" className="px-3 py-1.5 border border-border2 rounded-lg text-[12px] text-dim hover:text-bright no-underline transition-colors">← Dashboard</Link>
        </div>
      </header>

      <main className="p-7">{children}</main>
    </div>
  );
}

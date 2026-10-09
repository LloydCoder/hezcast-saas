"use client";
import { useState } from "react";

const BRAND_EMOJI: Record<string, string> = {
  GiftMode: "🎁", Tinlance: "🔒", WebTemify: "⚡", HezCast: "📡",
};

const DEFAULT_BRANDS = [
  { name: "GiftMode",  tone: "emotional",       audience: "Consumers 25-40",       hooks: 5, duration: 25, cta: "Try GiftMode free → giftmode.app",      color: "#FF6B9D", persona: "Maya",  videos: 21 },
  { name: "Tinlance",  tone: "authority",        audience: "Business owners",       hooks: 3, duration: 30, cta: "Book a consultation → tinlance.com",    color: "#00D4FF", persona: "Lloyd", videos: 14 },
  { name: "WebTemify", tone: "developer_energy", audience: "Founders & developers", hooks: 4, duration: 22, cta: "Browse templates → webtemify.com",      color: "#7C3AED", persona: "Dev",   videos: 8  },
  { name: "HezCast",   tone: "founder_energy",   audience: "Founders & agencies",   hooks: 5, duration: 25, cta: "Try HezCast free → cast.tinlance.com",  color: "#00D4FF", persona: "Lloyd", videos: 8  },
];

function BrandCard({ brand }: { brand: typeof DEFAULT_BRANDS[0] }) {
  return (
    <div className="bg-ink2 border border-border rounded-xl overflow-hidden hover:-translate-y-0.5 transition-all group"
      style={{ borderTopColor: brand.color }}>
      <div className="h-0.5" style={{ background: brand.color }} />
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-[32px]">{BRAND_EMOJI[brand.name] || "🎯"}</div>
            <div>
              <div className="text-[16px] font-bold" style={{ color: brand.color }}>{brand.name}</div>
              <div className="font-mono text-[10px] tracking-[0.1em] uppercase text-muted mt-0.5">{brand.tone}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {[
            { label: "Persona",   value: brand.persona },
            { label: "Hooks",     value: brand.hooks },
            { label: "Duration",  value: `${brand.duration}s` },
            { label: "Videos",    value: brand.videos },
          ].map(({ label, value }) => (
            <div key={label} className="bg-ink border border-border rounded-lg p-2.5">
              <div className="font-mono text-[9px] text-muted uppercase tracking-[0.08em] mb-1">{label}</div>
              <div className="text-[13px] font-semibold text-bright">{value}</div>
            </div>
          ))}
        </div>

        <div className="bg-ink border border-border rounded-lg p-2.5 mb-4">
          <div className="font-mono text-[9px] text-muted uppercase tracking-[0.08em] mb-1">Audience</div>
          <div className="text-[12px] text-txt">{brand.audience}</div>
        </div>

        <div className="bg-ink border border-border rounded-lg p-2.5 mb-4">
          <div className="font-mono text-[9px] text-muted uppercase tracking-[0.08em] mb-1">CTA</div>
          <div className="text-[11px] font-mono text-bright truncate">{brand.cta}</div>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full border-2" style={{ borderColor: brand.color, background: brand.color + "33" }} />
          <span className="font-mono text-[11px] text-muted">{brand.color}</span>
          <span className="ml-auto text-[11px] font-mono text-emerald">● Active</span>
        </div>
      </div>
    </div>
  );
}

function AddBrandModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({
    name: "", tone: "emotional", audience: "", cta: "",
    subtitle_color: "#00D4FF", hook_variants: 5, video_duration: 25,
  });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/hezcast/onboarding/brand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) onClose();
    } catch {}
    finally { setSaving(false); }
  };

  const inputCls = "w-full bg-ink border border-border2 rounded-lg px-3 py-2.5 text-[13px] text-snow outline-none focus:border-cyan transition-colors";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 backdrop-blur-sm">
      <div className="bg-ink2 border border-border rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div className="text-[15px] font-bold text-bright">Add New Brand</div>
          <button onClick={onClose} className="text-dim hover:text-bright text-xl leading-none transition-colors">×</button>
        </div>
        <div className="p-6 flex flex-col gap-4">
          <div>
            <div className="font-mono text-[10px] text-muted uppercase tracking-[0.08em] mb-1.5">Brand Name *</div>
            <input className={inputCls} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="MyBrand" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="font-mono text-[10px] text-muted uppercase tracking-[0.08em] mb-1.5">Tone</div>
              <select className={inputCls + " cursor-pointer"} value={form.tone} onChange={e => setForm(f => ({ ...f, tone: e.target.value }))}>
                {["emotional","authority","developer_energy","founder_energy","urgent"].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <div className="font-mono text-[10px] text-muted uppercase tracking-[0.08em] mb-1.5">Subtitle Color</div>
              <div className="flex items-center gap-2">
                <input type="color" value={form.subtitle_color} onChange={e => setForm(f => ({ ...f, subtitle_color: e.target.value }))} className="w-10 h-10 rounded-lg border border-border2 bg-ink cursor-pointer" />
                <input className={inputCls} value={form.subtitle_color} onChange={e => setForm(f => ({ ...f, subtitle_color: e.target.value }))} />
              </div>
            </div>
          </div>
          <div>
            <div className="font-mono text-[10px] text-muted uppercase tracking-[0.08em] mb-1.5">Audience</div>
            <input className={inputCls} value={form.audience} onChange={e => setForm(f => ({ ...f, audience: e.target.value }))} placeholder="e.g. Founders aged 28-45" />
          </div>
          <div>
            <div className="font-mono text-[10px] text-muted uppercase tracking-[0.08em] mb-1.5">CTA</div>
            <input className={inputCls} value={form.cta} onChange={e => setForm(f => ({ ...f, cta: e.target.value }))} placeholder="Try MyBrand free → mybrand.com" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="font-mono text-[10px] text-muted uppercase tracking-[0.08em] mb-1.5">Hook Variants (1-10)</div>
              <input type="number" min={1} max={10} className={inputCls} value={form.hook_variants} onChange={e => setForm(f => ({ ...f, hook_variants: +e.target.value }))} />
            </div>
            <div>
              <div className="font-mono text-[10px] text-muted uppercase tracking-[0.08em] mb-1.5">Video Duration (s)</div>
              <input type="number" min={10} max={60} className={inputCls} value={form.video_duration} onChange={e => setForm(f => ({ ...f, video_duration: +e.target.value }))} />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2 border-t border-border">
            <button onClick={onClose} className="px-4 py-2 border border-border2 text-[13px] text-dim hover:text-bright rounded-lg transition-colors">Cancel</button>
            <button onClick={save} disabled={saving || !form.name.trim()} className="px-5 py-2 bg-cyan text-ink text-[13px] font-bold rounded-lg hover:bg-cyan/90 disabled:opacity-50 transition-all">
              {saving ? "Saving..." : "Create Brand →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BrandsPage() {
  const [brands,      setBrands]     = useState(DEFAULT_BRANDS);
  const [showAdd,     setShowAdd]    = useState(false);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-[28px] tracking-[0.04em] text-snow leading-none">Brands</h1>
          <div className="font-mono text-[11px] text-muted mt-1">// {brands.length} brands configured · Pro plan allows 5</div>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-cyan rounded-lg text-[13px] font-bold text-ink hover:bg-cyan/90 transition-all">
          + Add Brand
        </button>
      </div>

      {/* Brand grid */}
      <div className="grid grid-cols-2 gap-4">
        {brands.map(b => <BrandCard key={b.name} brand={b} />)}
        {/* Empty slot */}
        {brands.length < 5 && (
          <button onClick={() => setShowAdd(true)}
            className="border-2 border-dashed border-border hover:border-cyan rounded-xl p-8 text-center transition-all group">
            <div className="text-3xl mb-3 opacity-30 group-hover:opacity-60 transition-opacity">+</div>
            <div className="text-[13px] text-muted group-hover:text-txt transition-colors">Add new brand</div>
            <div className="font-mono text-[10px] text-muted/60 mt-1">{5 - brands.length} slots remaining (Pro)</div>
          </button>
        )}
      </div>

      {/* Add modal */}
      {showAdd && <AddBrandModal onClose={() => setShowAdd(false)} />}
    </div>
  );
}

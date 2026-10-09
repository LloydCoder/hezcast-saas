import { SignUp } from "@clerk/nextjs";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-ink flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 no-underline">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan to-violet flex items-center justify-center font-mono font-black text-[17px] text-ink">H</div>
            <span className="font-display text-[26px] tracking-[0.06em] text-snow">Hez<span className="text-cyan">Cast</span></span>
          </Link>
          <p className="text-[13px] text-dim mt-2">Start free — 3 videos, no credit card</p>
        </div>
        <SignUp appearance={{ variables: { colorPrimary: "#00D4FF", colorBackground: "#0A0D14", colorText: "#EDF4FF", colorTextSecondary: "#8AA0BC", colorInputBackground: "#06080D", colorInputText: "#EDF4FF" } }} />
      </div>
    </div>
  );
}

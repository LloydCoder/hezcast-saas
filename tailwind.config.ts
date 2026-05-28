import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink:     "#06080D",
        ink2:    "#0A0D14",
        ink3:    "#0F131C",
        ink4:    "#141922",
        border:  "#1A2333",
        border2: "#1E2A3D",
        muted:   "#2E4060",
        dim:     "#4A6080",
        txt:     "#8AA0BC",
        bright:  "#C8D8EC",
        snow:    "#EDF4FF",
        cyan:    "#00D4FF",
        pink:    "#FF6B9D",
        violet:  "#7C3AED",
        emerald: "#10B981",
        amber:   "#F59E0B",
        danger:  "#EF4444",
      },
      fontFamily: {
        display: ["'Bebas Neue'", "cursive", "sans-serif"],
        body:    ["'Outfit'", "sans-serif"],
        mono:    ["'JetBrains Mono'", "monospace"],
      },
      animation: {
        "pulse-dot": "pulse-dot 2s ease-in-out infinite",
        "fade-up":   "fade-up 0.5s ease both",
        "slide-in":  "slide-in 0.2s ease both",
      },
      keyframes: {
        "pulse-dot": {
          "0%, 100%": { opacity: "1" },
          "50%":      { opacity: "0.3" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          from: { opacity: "0", transform: "translateY(-8px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;

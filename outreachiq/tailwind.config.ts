import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        background: "#050d1a",
        surface: "#0a1628",
        border: "#1a2d4a",
        primary: {
          DEFAULT: "#2563eb",
          foreground: "#ffffff",
        },
        text: {
          primary: "#e2e8f0",
          muted: "#475569",
        },
        accent: {
          blue: "#2563eb",
          green: "#22c55e",
          red: "#ef4444",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          from: { opacity: "0", transform: "translateX(-10px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        typewriter: {
          from: { width: "0" },
          to: { width: "100%" },
        },
        blink: {
          "50%": { opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.4s ease-out",
        "slide-in": "slide-in 0.3s ease-out",
        shimmer: "shimmer 2s linear infinite",
        blink: "blink 1s step-end infinite",
      },
      boxShadow: {
        "glow-blue": "0 0 20px rgba(37, 99, 235, 0.15)",
        "glow-blue-lg": "0 0 40px rgba(37, 99, 235, 0.2)",
        "glow-green": "0 0 20px rgba(34, 197, 94, 0.15)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;

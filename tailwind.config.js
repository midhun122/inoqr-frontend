/** @type {import('tailwindcss').Config} */
const withAlpha = (name) => `rgb(var(${name}) / <alpha-value>)`;

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: withAlpha("--ink"),
        "ink-soft": withAlpha("--ink-soft"),
        muted: withAlpha("--muted"),
        faint: withAlpha("--faint"),
        canvas: withAlpha("--canvas"),
        "canvas-soft": withAlpha("--canvas-soft"),
        field: withAlpha("--field"),
        hairline: withAlpha("--hairline"),
        accent: withAlpha("--accent"),
        "accent-deep": withAlpha("--accent-deep"),
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["DM Serif Display", "Georgia", "Times New Roman", "serif"],
        mono: ["Roboto Mono", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
        "2xl": "24px",
      },
      height: {
        btn: "48px",
        "btn-sm": "40px",
        input: "48px",
      },
      maxWidth: {
        shell: "1160px",
        narrow: "760px",
      },
      transitionDuration: {
        fast: "180ms",
        base: "320ms",
        slow: "600ms",
      },
      boxShadow: {
        card: "0 1px 2px rgba(20,20,20,0.06), 0 8px 24px rgba(20,20,20,0.06)",
        pop: "0 1px 2px rgba(0,102,255,0.28), 0 8px 22px rgba(0,102,255,0.16)",
      },
    },
  },
  plugins: [],
}

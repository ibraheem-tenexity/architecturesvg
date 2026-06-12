import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Hanken Grotesk", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Georgia", "Times New Roman", "serif"],
        mono: ["ui-monospace", "JetBrains Mono", "SF Mono", "Menlo", "monospace"],
      },
      colors: {
        border: "hsl(var(--border))",
        "border-subtle": "hsl(var(--border-subtle))",
        "border-default": "hsl(var(--border-default))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        raised: { DEFAULT: "hsl(var(--raised))", foreground: "hsl(var(--raised-foreground))" },
        sunken: { DEFAULT: "hsl(var(--sunken))", foreground: "hsl(var(--sunken-foreground))" },
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        brand: {
          DEFAULT: "hsl(var(--brand))",
          foreground: "hsl(var(--brand-foreground))",
          soft: "hsl(var(--brand-soft))",
          deep: "hsl(var(--brand-deep))",
        },
        secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
        success: { DEFAULT: "hsl(var(--success))", foreground: "hsl(var(--success-foreground))", soft: "hsl(var(--success-soft))" },
        warning: { DEFAULT: "hsl(var(--warning))", foreground: "hsl(var(--warning-foreground))", soft: "hsl(var(--warning-soft))" },
        danger: { DEFAULT: "hsl(var(--danger))", foreground: "hsl(var(--danger-foreground))", soft: "hsl(var(--danger-soft))" },
        viz: {
          1: "hsl(var(--viz-1))",
          2: "hsl(var(--viz-2))",
          3: "hsl(var(--viz-3))",
          4: "hsl(var(--viz-4))",
          5: "hsl(var(--viz-5))",
          6: "hsl(var(--viz-6))",
          7: "hsl(var(--viz-7))",
        },
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;

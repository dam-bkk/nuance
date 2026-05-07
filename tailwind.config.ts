import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: { DEFAULT: "var(--card)", foreground: "var(--card-foreground)" },
        popover: { DEFAULT: "var(--popover)", foreground: "var(--popover-foreground)" },
        primary: { DEFAULT: "var(--primary)", foreground: "var(--primary-foreground)" },
        secondary: { DEFAULT: "var(--secondary)", foreground: "var(--secondary-foreground)" },
        muted: { DEFAULT: "var(--muted)", foreground: "var(--muted-foreground)" },
        accent: { DEFAULT: "var(--accent)", foreground: "var(--accent-foreground)" },
        destructive: { DEFAULT: "var(--destructive)", foreground: "var(--destructive-foreground)" },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        // Semantic palette — CSS-variable driven (flips in dark mode)
        pg:      "var(--pg)",      // page background
        ink:     "var(--ink)",     // near-black text
        navy:    "var(--navy)",    // hover / dark blue
        cobalt:  "#3B4EF5",        // primary blue (same in both modes)
        crimson: "#E5193A",        // error / red
        dim:     "var(--dim)",     // muted text
        edge:    "var(--edge)",    // borders
        frost:   "var(--frost)",   // hover bg
        surface: "var(--surface)", // card surface (white in light, dark in dark)
      },
      fontFamily: {
        sans: ["var(--font-sans)", "sans-serif"],
      },
      borderRadius: {
        "4xl": "2rem",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
};
export default config;

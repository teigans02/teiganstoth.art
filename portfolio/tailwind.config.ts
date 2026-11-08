import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/projects/**/*.mdx",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontWeight: {
        medium: '450',
      },
      fontFamily: {
        sans: ['var(--font-instrument-sans)', 'Arial', 'sans-serif'],
        instrument: ['var(--font-instrument)', 'serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            'h1, h2, h3, h4, h5, h6': {
              fontFamily: 'var(--font-instrument-sans), sans-serif',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
} satisfies Config;

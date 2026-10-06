import type { Config } from "tailwindcss";

// Os nomes de fonte do código antigo (font-dm, font-fraunces, font-mono)
// viram papéis: cada app diz qual fonte faz cada papel (globals.css).
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        fraunces: ["var(--f-titulo)"],
        dm: ["var(--f-ui)"],
        mono: ["var(--f-num)"],
      },
      borderRadius: { "2xl": "1rem", "3xl": "1.25rem" },
    },
  },
  plugins: [],
};
export default config;

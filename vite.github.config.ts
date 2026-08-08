import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const DEFAULT_SITE_URL = "https://YOUR-USERNAME.github.io";

export default defineConfig({
  base: "/",
  publicDir: "public",
  plugins: [
    react(),
    {
      name: "github-pages-site-url",
      transformIndexHtml(html) {
        const siteUrl = (process.env.VITE_SITE_URL ?? DEFAULT_SITE_URL).replace(/\/+$/, "");
        return html.replaceAll("__SITE_URL__", siteUrl);
      },
    },
  ],
  build: {
    outDir: "dist-github",
    emptyOutDir: true,
  },
});

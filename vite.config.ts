import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import content from "./src/config/wedding-content.json";

// Emit metadata into HTML so link preview crawlers can read it without JavaScript.
const couple = `${content.groomName} & ${content.brideName}`;
const metadata: Record<string, string> = {
  WEDDING_TITLE: `${couple} · Thiệp cưới`,
  WEDDING_DESCRIPTION: `${couple} — ${content.copy.opening}. Trân trọng mời bạn đến chung vui trong ngày cưới của chúng mình.`,
};
const escapeHtml = (value: string) => value.replace(/[&<>"']/g, character => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
})[character]!);

// Relative assets also work when the repository name changes on GitHub Pages.
export default defineConfig({
  plugins: [react(), tailwindcss(), {
    name: "wedding-metadata",
    transformIndexHtml: {
      order: "pre",
      handler: html => html.replace(/%WEDDING_(?:TITLE|DESCRIPTION)%/g, token => escapeHtml(metadata[token.slice(1, -1)])),
    },
  }],
  base: "./",
  optimizeDeps: { entries: ["index.html"] },
  server: { watch: { ignored: ["**/artifacts/**"] } },
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Relative assets also work when the repository name changes on GitHub Pages.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "./",
  optimizeDeps: { entries: ["index.html"] },
  server: { watch: { ignored: ["**/artifacts/**"] } },
});

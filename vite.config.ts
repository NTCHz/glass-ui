import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // demos load lazily, so without this the dev optimizer finds @base-ui/react/menu
  // and /menubar in separate passes, bundles MenubarContext twice, and menubar
  // triggers lose role="menuitem" and arrow-key navigation (dev only; build is fine)
  optimizeDeps: { entries: ["index.html", "src/**/*.tsx"] },
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
});

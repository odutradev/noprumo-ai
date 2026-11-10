import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import path from "path"

const folders = ["assets", "components", "hooks", "pages", "providers", "routes", "stores", "styles", "utils"]

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: Object.fromEntries(folders.map((folder) => [`@${folder}`, path.resolve(import.meta.dirname, `./src/${folder}`)])),
    dedupe: ["react", "react-dom"]
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react-dom/client", "react-router", "zustand", "zustand/middleware", "enchase", "enchase/icons", "enchase/locales", "zod"]
  },
  server: {
    host: "0.0.0.0",
    port: 8080
  },
  build: {
    outDir: "build"
  }
})

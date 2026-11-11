import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import path from "path"

const folders = ["assets", "components", "hooks", "pages", "providers", "routes", "stores", "styles", "utils"]

const fromPackages = (names: string[]) => new RegExp(`node_modules[/\\\\](${names.join("|")})[/\\\\]`)

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
    outDir: "build",
    cssCodeSplit: true,
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            { name: "react", test: fromPackages(["react", "react-dom", "scheduler", "react-router"]), priority: 30 },
            { name: "enchase", test: fromPackages(["enchase"]), priority: 20 },
            { name: "vendor", test: fromPackages([".+?"]), priority: 10 }
          ]
        }
      }
    }
  }
})

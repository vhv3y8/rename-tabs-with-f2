import { defineConfig } from "vite"
import { svelte } from "@sveltejs/vite-plugin-svelte"

export default defineConfig({
  root: "src",
  publicDir: "../public",
  build: {
    outDir: "../dist",
    assetsDir: ".", // if not set to ".", js/css files are created at dist/assets/
    emptyOutDir: true, // empty dist folder before build
    target: "esnext", // to use top level await
    rollupOptions: {
      input: ["src/main/index.html", "src/content.js", "src/sw.js"],
      output: {
        entryFileNames: "[name].js", // applied to js files
      },
    },
  },
  plugins: [svelte()],
})

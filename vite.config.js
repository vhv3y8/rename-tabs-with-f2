import { defineConfig } from "vite"
import { svelte } from "@sveltejs/vite-plugin-svelte"
import zipPack from "vite-plugin-zip-pack"
import manifest from "./public/manifest.json"

export default defineConfig(({ mode }) => {
  return {
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
    plugins: [
      svelte(),
      ...(mode === "production"
        ? [
            zipPack({
              inDir: "dist",
              outDir: ".",
              outFileName: `${manifest.name}-${manifest.version}.zip`,
            }),
          ]
        : []),
    ],
  }
})

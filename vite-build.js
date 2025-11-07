import { build } from "vite"
import { svelte } from "@sveltejs/vite-plugin-svelte"
import zipPack from "vite-plugin-zip-pack"
import manifest from "./public/manifest.json" with { type: "json" }

const isProduction = process.env.MODE === "production"
console.log("[isProduction] ", isProduction)

// Common Plugin

const commonPlugins = [
  zipPack({
    inDir: "dist",
    outDir: ".",
    outFileName: `${manifest.name}-${manifest.version}.zip`,
  }),
]

// Config

const svelteConfig = (input, last = false) => {
  return {
    root: "src",
    publicDir: "../public",
    build: {
      outDir: "../dist",
      assetsDir: ".", // if not set to ".", js/css files are created at dist/assets/
      emptyOutDir: true, // empty dist folder before build
      target: "esnext", // to use top level await
      rollupOptions: {
        input,
        output: {
          entryFileNames: "[name].js", // applied to js files
        },
      },
      sourcemap: !isProduction,
    },
    plugins: [svelte(), ...(isProduction && last ? commonPlugins : [])],
  }
}
const jsConfig = (input, last = false) => {
  return {
    root: "src",
    build: {
      outDir: "../dist",
      rollupOptions: {
        input,
        inlineDynamicImports: true,
        output: {
          entryFileNames: "[name].js", // applied to js files
        },
      },
    },
    plugins: [...(isProduction && last ? commonPlugins : [])],
  }
}

// Build

const entries = ["src/main/index.html", "src/content.js", "src/sw.js"]

// Run vite build for each entries
// bundle and treeshake each entry, without making shared chunk
// shared chunk is not possible because service worker and content script cannot be module.
// so this build script enables to write and use shared chrome api related modules (lib/chrome/)
async function run() {
  const lastIdx = entries.length - 1

  for (let i = 0; i < entries.length; i++) {
    const input = entries[i]

    if (input.endsWith(".js")) {
      await build(jsConfig(input, i == lastIdx))
    } else if (input.endsWith(".html")) {
      await build(svelteConfig(input, i == lastIdx))
    }
  }
}

run()

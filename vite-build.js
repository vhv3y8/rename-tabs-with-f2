import { build } from "vite"
import { svelte } from "@sveltejs/vite-plugin-svelte"
import zipPack from "vite-plugin-zip-pack"
import manifest from "./public/manifest.json" with { type: "json" }
import path from "node:path"
import fs from "node:fs/promises"

const isProduction = process.env.MODE === "production"
const buildDist2ForTest = process.env.DIST2 === "true"

console.log("[isProduction]", isProduction)
console.log("[buildDist2ForTest]", buildDist2ForTest)

// Common Plugin

const commonPlugins = [
  zipPack({
    inDir: buildDist2ForTest ? "dist2" : "dist",
    outDir: ".",
    outFileName: `${manifest.name}-${manifest.version}${buildDist2ForTest ? "2" : ""}.zip`,
  }),
]

// Config

const commonConfig = {
  root: "src",
  resolve: {
    alias: {
      $$lib: "/lib",
    },
  },
  define: {
    __TEST_MIGRATION__: buildDist2ForTest,
  },
  build: {
    outDir: buildDist2ForTest ? "../dist2" : "../dist",
    rollupOptions: {
      output: {
        entryFileNames: "[name].js", // applied to js files
      },
    },
  },
}

const createSvelteConfig = (input, last = false) => {
  return deepMerge(commonConfig, {
    publicDir: "../public",
    build: {
      assetsDir: ".", // if not set to ".", js/css files are created at dist/assets/
      target: "esnext", // to use top level await
      sourcemap: !isProduction,
      rollupOptions: {
        input,
      },
    },
    plugins: [svelte(), ...(isProduction && last ? commonPlugins : [])],
  })
}
const createJsConfig = (input, last = false) => {
  return deepMerge(commonConfig, {
    build: {
      inlineDynamicImports: true,
      rollupOptions: {
        input,
      },
    },
    plugins: [...(isProduction && last ? commonPlugins : [])],
  })
}

// Utils

function deepMerge(original = {}, toMerge = {}) {
  const isObj = (x) => x && typeof x === "object" && !Array.isArray(x)

  const out = { ...original }

  for (const k in toMerge) {
    const v = toMerge[k]
    const t = out[k]

    if (isObj(t) && isObj(v)) out[k] = deepMerge(t, v)
    else if (Array.isArray(t) && Array.isArray(v)) out[k] = [...t, ...v]
    else out[k] = v
  }

  return out
}

// Setting emptyOutDir at vite config empties folder at every build() run
async function emptyOutDirOnce() {
  const outDir = path.resolve(commonConfig.root, commonConfig.build.outDir)
  console.log("[emptying out dir]", outDir)

  try {
    await fs.mkdir(outDir, { recursive: true })
  } catch {}
  const items = await fs.readdir(outDir)

  for (const item of items) {
    const full = path.join(outDir, item)
    const s = await fs.stat(full)

    if (s.isDirectory()) {
      await fs.rm(full, { recursive: true, force: true })
    } else {
      await fs.rm(full, { force: true })
    }
  }
}

async function updateExtensionVersion() {
  const manifestFilePath = path.resolve(
    commonConfig.root,
    commonConfig.build.outDir,
    "manifest.json",
  )
  const manifestRaw = await fs.readFile(manifestFilePath, "utf-8")

  let manifestJson = JSON.parse(manifestRaw)
  const version = manifestJson.version.split(".")
  version[version.length - 1] = parseInt(version[version.length - 1]) + 1
  manifestJson.version = version.join(".")

  await fs.writeFile(manifestFilePath, JSON.stringify(manifestJson, null, 2))
}

// Build

const entries = ["src/main/index.html", "src/content.js", "src/sw.js"]
if (!isProduction) entries.push("src/test-bridge.html", "src/test-bridge.js")

// Run vite build for each entries
// bundle and treeshake each entry, without making shared chunk
// shared chunk is not possible because service worker and content script cannot be module.
// so this build script enables to write and use shared chrome api related modules (lib/chrome/)
async function run() {
  const lastIdx = entries.length - 1

  for (let i = 0; i < entries.length; i++) {
    const input = entries[i]

    if (input.endsWith(".js")) {
      await build({
        ...createJsConfig(input, i == lastIdx),
        mode: process.env.MODE || "production",
      })
    } else if (input.endsWith(".html")) {
      await build({
        ...createSvelteConfig(input, i == lastIdx),
        mode: process.env.MODE || "production",
      })
    }
  }
}

await emptyOutDirOnce()
await run()
if (buildDist2ForTest) await updateExtensionVersion()

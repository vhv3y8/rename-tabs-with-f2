import { svelte } from "@sveltejs/vite-plugin-svelte"
import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    include: ["src/tests/unit/**/*"],
    environment: "jsdom",
  },
  plugins: [svelte()],
  resolve: {
    alias: {
      $main: "/src/main",
      $$lib: "/src/lib",
    },
  },
})

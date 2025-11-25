import type { StorybookConfig } from "@storybook/svelte-vite"

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(js|ts|svelte)"],
  addons: ["@storybook/addon-svelte-csf"],
  framework: {
    name: "@storybook/svelte-vite",
    options: {},
  },
  viteFinal: (config) => ({
    ...config,
    resolve: {
      alias: {
        $main: "/src/main",
      },
    },
  }),
}
export default config

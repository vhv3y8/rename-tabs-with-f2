<script module>
import { defineMeta } from "@storybook/addon-svelte-csf"
import GlobalToastGrid from "$main/components/GlobalToastGrid.svelte"
import { appendToast, messages } from "../../main/lib/ui/states/toasts.svelte"

const { Story } = defineMeta({
  title: "GlobalToastGrid",
  component: GlobalToastGrid,
  parameters: {},
  args: {},
  decorators: [
    (Story) => {
      globalThis.chrome = {
        i18n: {
          getMessage: (messageName, substitutions) =>
            `Shortcut is updated to '${substitutions}'.\nIf you want to use it at existing tabs, you have to refresh that tab!`,
        },
      }
      return Story
    },
  ],
})
</script>

<Story
  name="Light mode"
  play={() => {
    document.documentElement.classList.remove("dark")
    appendToast(messages.SHORTCUT_UPDATED("Ctrl + Shift + F2"))
  }}
/>

<Story
  name="Dark mode"
  play={() => {
    document.documentElement.classList.add("dark")
    appendToast(messages.SHORTCUT_UPDATED("F2"))
  }}
/>

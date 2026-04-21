<script module>
import { defineMeta } from "@storybook/addon-svelte-csf"
import Toast from "$main/components/common/Toast.svelte"
import "$main/style/ds.css"

const { Story } = defineMeta({
  title: "Toast toast",
  component: Toast,
  parameters: {},
  args: {},
})
</script>

<Story name="greetings" args={{ text: "hi there bye" }} />

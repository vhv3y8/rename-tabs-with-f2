<script lang="ts">
import HeaderBar from "./adapters/ui/HeaderBar.svelte"
import NotConnectedCard from "./adapters/ui/tabs/NotConnectedCard.svelte"
import TabList from "./adapters/ui/tabs/TabList.svelte"
import FooterBar from "./adapters/ui/FooterBar.svelte"
import { cancelAllKeydowns } from "./adapters/ui/reactivity/keys.svelte"
import { onMount } from "svelte"

function keyupReactivityHandler() {
  cancelAllKeydowns()
}

onMount(async () => {
  // run bootstrap
  await import("./bootstrap.svelte")
})
</script>

<!-- HTML -->

<svelte:document onkeyup={keyupReactivityHandler} />

<main class:large={app.setting.largerWidth}>
  <HeaderBar />
  <NotConnectedCard />
  <TabList />
  <FooterBar />
</main>

<!-- Style -->

<style>
:global(body) {
  background-color: var(--bg);
}

main {
  flex: 1 0 auto;

  display: flex;
  flex-flow: column nowrap;

  width: min(100%, var(--width-normal));
}
main.large {
  width: min(100%, var(--width-large));
}
</style>

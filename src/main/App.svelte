<script lang="ts">
import { onMount } from "svelte"
import HeaderBar from "./adapters/ui/components/HeaderBar.svelte"
import NotConnectedCard from "./adapters/ui/tabs/NotConnectedCard.svelte"
import TabList from "./adapters/ui/tabs/TabList.svelte"
import FooterBar from "./adapters/ui/components/FooterBar.svelte"
//
import { cancelAllKeydowns } from "./adapters/ui/reactivity/keys.svelte"
import { setting } from "./adapters/ui/components/setting/states/inMemorySetting.svelte"
import { runBootstrap } from "./bootstrap"
import { setInjectionsContext } from "./adapters/ui/injections"

// inject to svelte components
const uiInjections: Awaited<ReturnType<typeof runBootstrap>> = $props()
setInjectionsContext(uiInjections)

function keyupReactivityHandler() {
  cancelAllKeydowns()
}

onMount(async () => {
  // await ChromeMainFacadeImpl.focusExtensionPageTabForRefresh()
  // view.initializeViewFromSettings()
  // focusTabItem({ initial: true })
})
</script>

<!-- HTML -->

<svelte:document onkeyup={keyupReactivityHandler} />

<main class:large={setting.largerWidth}>
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

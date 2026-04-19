<script lang="ts">
import { onMount } from "svelte"
import TabList from "./adapters/ui/components/tabs/TabList.svelte"
import HeaderBar from "./adapters/ui/components/HeaderBar.svelte"
import NotConnectedCard from "./adapters/ui/components/tabs/NotConnectedCard.svelte"
import FooterBar from "./adapters/ui/components/FooterBar.svelte"
//
import { cancelAllKeydowns } from "./adapters/ui/components/reactivity/keys.svelte"
import { setting } from "./adapters/ui/components/setting/states/inMemorySetting.svelte"
import { runBootstrap } from "./bootstrap"
import { setInjectionsContext } from "./adapters/ui/injections"
import GlobalToastGrid from "./adapters/ui/components/toast/GlobalToastGrid.svelte"

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

<GlobalToastGrid />

<main
  class:large={setting.largerWidth}
  class="flex flex-col flex-nowrap grow shrink-0 basis-auto"
>
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
  width: min(100%, var(--width-normal));
}
main.large {
  width: min(100%, var(--width-large));
}
</style>

<script lang="ts">
import { settingState } from "@adapters/settings/states/settings.svelte"
import NotConnectedCard from "@adapters/tabs/NotConnectedCard.svelte"
import { onDestroy, onMount } from "svelte"

// import HeaderBar from "./infra/ui/components/sections/HeaderBar.svelte"
// import BlurDescriptionCard from "./BlurDescriptionCard.svelte"
// import TabItem from "../components/TabItem.svelte"
// import FooterBar from "./FooterBar.svelte"
// import GlobalToastGrid from "../components/GlobalToastGrid.svelte"
// import Debug from "./Debug.svelte"

// import * as chromeTabs from "../lib/chrome/tabs"

// import { checkContentScriptAvailableAndUpdateAllInfo } from "./application/usecases/checkTabConnection"
// import {
//   initializeLastFocusTabId,
//   initializeTabIdxToInfo,
// } from "./application/usecases/initializeTabInfos"
// import {
//   allTabItems,
//   focusTabItem,
// } from "../lib/ui/states/tabs/tabItems.svelte"

// import * as view from "../lib/ui/view"
// import {
//   destroySettingsEffect,
//   settings,
// } from "../lib/ui/states/settings.svelte"
// import { tabIdxToInfo } from "./lib/application/tabInfo.svelte"
// import { keydownHandler, keyupHandler } from "../lib/ui/keyboard"

// lifecycle
onMount(async () => {
  if (import.meta.env.MODE === "development") console.log("[onMount]")
  await chromeTabs.focusExtensionPageTabForRefresh()

  // initialize application entities
  await initializeTabIdxToInfo()
  await initializeLastFocusTabId()

  // initialize view from storage
  view.initializeViewFromSettings()

  // update global state
  await checkContentScriptAvailableAndUpdateAllInfo()

  // initialize view
  focusTabItem({ initial: true })

  if (import.meta.env.MODE === "development")
    console.log("[onMount] [tabIdxToInfo]", Object.values(tabIdxToInfo))
})

onDestroy(() => {
  destroySettingsEffect()
})
</script>

<!-- Event Handlers -->

<svelte:document onkeydown={keydownHandler} onkeyup={keyupHandler} />

<!-- HTML -->

<main class:large={settingState.settings.largerWidth}>
  <NotConnectedCard />
  <!-- <HeaderBar /> -->

  <!-- <Debug /> -->

  <!-- <BlurDescriptionCard /> -->

  <!-- TabItem List -->
  <!-- <ul>
    {#each Object.values(tabIdxToInfo) as tabInfo, idx}
      <TabItem bind:this={allTabItems[idx]} {tabInfo} />
    {/each} -->
  <!-- </ul> -->

  <!-- <FooterBar /> -->

  <!-- Fixed -->

  <!-- <GlobalToastGrid /> -->
</main>

<!-- Style -->

<style>
/* Common */

:global(body) {
  background-color: var(--bg);
}

/* Main */

main {
  flex: 1 0 auto;

  display: flex;
  flex-flow: column nowrap;

  width: min(100%, var(--width-normal));
}
main.large {
  width: min(100%, var(--width-large));
}

/* Tab List */
ul {
  flex: 1 1 0px;
  overflow-y: auto;

  padding: 0;
  width: 100%;

  padding-right: 1em;
  box-sizing: border-box;
}

ul::-webkit-scrollbar {
  width: 0.6rem;
}
ul::-webkit-scrollbar-thumb {
  background-color: var(--shadow-9);
  border: 3px solid var(--shadow-9);
}
</style>

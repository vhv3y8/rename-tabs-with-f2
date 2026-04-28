<script lang="ts">
// import { tabItemComponents } from "./states/tabItemComponents.svelte"
import TabItem from "./TabItem.svelte"
import { getInjections } from "../../injections"
import { onMount } from "svelte"
import { settingModal } from "../setting/states/settingModal.svelte"
import {
  cancelAllMoveAroundKeydowns,
  keydowns,
} from "../reactivity/keys.svelte"

const { tabIdxInfoStore, tabItemComponents } = getInjections()

function keydownMoveAroundTabItemsHandler(e: KeyboardEvent) {
  if (settingModal.listen) return

  switch (e.key) {
    case "Tab": {
      e.preventDefault()
      if (e.shiftKey) {
        keydowns.shiftTab = true
        tabItemComponents.focusPreviousItem()
      } else {
        keydowns.tab = true
        tabItemComponents.focusNextItem()
      }
      break
    }
    case "Enter": {
      e.preventDefault()
      if (e.shiftKey) {
        keydowns.shiftEnter = true
        tabItemComponents.focusPreviousItem()
      } else {
        keydowns.enter = true
        tabItemComponents.focusNextItem()
      }
      break
    }
    case "Escape": {
      e.preventDefault()
      // if (settingModal.hideIfVisible()) break
      // TODO
      if (settingModal.show) break
      keydowns.esc = true
      tabItemComponents.focusInitialItem()
      break
    }
    default: {
      cancelAllMoveAroundKeydowns()
    }
  }
}

onMount(() => {
  tabItemComponents.focusInitialItem()
})
</script>

<!-- HTML -->

<svelte:document onkeydown={keydownMoveAroundTabItemsHandler} />

<ul>
  {#each tabIdxInfoStore.getAllTabInfos() as tabInfo, idx}
    <TabItem bind:this={tabItemComponents.components[idx]} {tabInfo} />
  {/each}
</ul>

<!-- Style -->

<style>
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

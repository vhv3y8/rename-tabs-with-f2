<script>
import { onDestroy, onMount } from "svelte"
import TabItem from "./components/TabItem.svelte"
import SettingsPopover from "./components/SettingsPopover.svelte"
import * as chromeTabs from "../lib/chrome/tabs"

import {
  destroySettingsEffect,
  settings,
} from "./lib/ui/states/settings.svelte"
import {
  filterUrlsBlockedByBrowser,
  getAllTabStatus,
  // getContentScriptUnavailableTabs,
  getRefreshAndBrowserUnavailableTabs,
  getTabInfoById,
  tabIdxToInfo,
} from "./lib/application/tabInfo.svelte"
// import { modes } from "./lib/ui/states/modes.svelte"

import {
  createNormalKeydownHandler,
  removeAllKeydownClass,
} from "./lib/ui/eventHandlers"
import * as view from "./lib/ui/view"

import { apply } from "./lib/application/usecases/apply"
import { checkContentScriptAvailableAndUpdateAllInfo } from "./lib/application/usecases/checkContentScriptAvailable"
import GlobalToastGrid from "./components/GlobalToastGrid.svelte"
import {
  initializeLastFocusTabId,
  initializeTabIdxToInfo,
} from "./lib/application/usecases/initializeTabInfos"
import Key from "./components/common/Key.svelte"
import { reloadAllConnectableTabs } from "./lib/application/usecases/reloadAllConnectableTabs"
import FooterBar from "./app/FooterBar.svelte"
import HeaderBar from "./app/HeaderBar.svelte"
import {
  allTabItems,
  // bindGlobalULElem,
  focusableInputElements,
  focusableTabItems,
  focusTabItem,
  // resetCurrentFocusInputIdx,
  // tabsElems,
  // ulElem,
} from "./lib/ui/states/tabs/tabElems.svelte"
import { keydownHandler, keyupHandler } from "./lib/ui/keyboard"
import BlurDescriptionCard from "./app/BlurDescriptionCard.svelte"
import Debug from "./app/Debug.svelte"

// function bindULElem(node) {
//   bindGlobalULElem(node)
// }

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
  focusTabItem({ initial: true })

  if (import.meta.env.MODE === "development")
    console.log("[tabIdxToInfo]", tabIdxToInfo)

  // initialize view stuff
  // setInitialFocusElemAndFocus()
  // updateFocusableInputElements()
  // initializeIndexes()

  // switch binded components into html element with <Key> component function
  // elements.tabKeyBtn = elements.tabKeyBtn.getElem()
  // elements.ctrlEnterBtn = elements.ctrlEnterBtn.getElem()
  // elements.shiftTabKeyBtn = elements.shiftTabKeyBtn.getElem()
  // elements.enterKeyBtn = elements.enterKeyBtn.getElem()
  // elements.shiftEnterKeyBtn = elements.shiftEnterKeyBtn.getElem()
  // elements.escKeyBtn = elements.escKeyBtn.getElem()
})

// onDestroy(() => {
//   destroySettingsEffect()
// })
</script>

<!-- Event Handlers -->

<!-- <svelte:document
  onkeydown={(e) => {
    if (!modes.listenShortcutUpdate) {
      // create and run keydown handler
      createNormalKeydownHandler({
        elements,
        focusPreviousElement: () => {
          focusInputElement({ focusNext: false })
        },
        focusNextElement: () => {
          focusInputElement({ focusNext: true })
        },
        focusInitialElement: focusInitialFocusTabItem,
        closeSettingsIfItsVisible: () => {
          if (showSettings) {
            showSettings = false
            return true
          }
          return false
        },
        dismissUnavailableCard: (e) => {
          if (showUnavailableCard) {
            e.preventDefault()
            showUnavailableCard = false
          }
        },
        handleReload: (e) => {
          if (showUnavailableCard) {
            e.preventDefault()
            handleReload()
          }
        },
      })(e)
    }
  }}
  onkeyup={removeAllKeydownClass}
/> -->

<svelte:document onkeydown={keydownHandler} onkeyup={keyupHandler} />

<!-- HTML -->

<main class:large={settings.largerWidth}>
  <HeaderBar />

  <!-- <Debug /> -->

  <BlurDescriptionCard />

  <!-- TabItem List -->
  <ul>
    {#each Object.values(tabIdxToInfo) as tabInfo, idx}
      <!-- {JSON.stringify({ tabInfo, idx }, null, 2)} -->
      <TabItem bind:this={allTabItems[idx]} {tabInfo} />
      <!-- setCurrentFocusInputIdx={() => {
          currentFocusInputIdx = idx
        }} -->
    {/each}
  </ul>

  <FooterBar />

  <!-- Fixed -->

  <GlobalToastGrid />
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

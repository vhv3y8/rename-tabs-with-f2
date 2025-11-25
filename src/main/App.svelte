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
  getLastFocusTabIdWritable,
  getTabInfoById,
  tabIdxToInfo,
} from "./lib/application/tabInfo.svelte"
import { modes } from "./lib/ui/states/modes.svelte"

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

function initializeViewFromSettings() {
  if (import.meta.env.MODE === "development")
    console.log("[initializeViewFromSettings]")

  view.applyDarkModeUI({ darkmode: settings.darkmode })
  view.applyLargerWidth({ largerWidth: settings.largerWidth })
}

// elements state
let elements = {
  ulElem: null,
  initialFocusTabItem: null,

  ctrlEnterBtn: null,
  tabKeyBtn: null,
  shiftTabKeyBtn: null,
  enterKeyBtn: null,
  shiftEnterKeyBtn: null,
  escKeyBtn: null,

  keydownElem: null,
}

function setInitialFocusElemAndFocus() {
  if (import.meta.env.MODE === "development")
    console.log("[setInitialFocusElemAndFocus]")

  const lastFocusTabId = getLastFocusTabIdWritable()
  let initialTabId =
    lastFocusTabId !== null
      ? lastFocusTabId
      : Object.values(tabIdxToInfo).filter(
          (tabInfo) => tabInfo.contentScriptAvailable,
        )[0].id

  elements.initialFocusTabItem = elements.ulElem.querySelector(
    `input#tab-${initialTabId}`,
  )

  if (import.meta.env.MODE === "development")
    console.log(
      "[lastFocusTabId, tabIdxToInfo, initialTabId]",
      getLastFocusTabIdWritable(),
      tabIdxToInfo,
      initialTabId,
    )

  elements.initialFocusTabItem.click()
  elements.initialFocusTabItem.scrollIntoView({ block: "center" })
}

// focusable input elements state
let focusableInputElements = $state(null)

function initializeFocusableInputElementsThatsAvailable() {
  if (import.meta.env.MODE === "development")
    console.log("[initializeFocusableInputElementsThatsAvailable]")

  focusableInputElements = Array.from(
    elements.ulElem.querySelectorAll("input"),
  ).filter(({ id }) => {
    let tabInfo = getTabInfoById(id.slice(4))
    return tabInfo && tabInfo.contentScriptAvailable
  })
  if (import.meta.env.MODE === "development")
    console.log("[focusableInputElements]", focusableInputElements)
}

// focus indexes state
let currentFocusInputIdx = $state(null)
let initialFocusInputIdx = $state(null)

function initializeIndexes() {
  if (import.meta.env.MODE === "development") console.log("[initializeIndexes]")

  initialFocusInputIdx = focusableInputElements.indexOf(
    elements.initialFocusTabItem,
  )
  currentFocusInputIdx = initialFocusInputIdx
}

function focusInputElement({ focusNext }) {
  const lastIdx = focusableInputElements.length - 1

  let nextFocusInputIdx
  if (focusNext) {
    // next
    nextFocusInputIdx =
      currentFocusInputIdx === lastIdx ? 0 : currentFocusInputIdx + 1
  } else {
    // previous
    nextFocusInputIdx =
      currentFocusInputIdx === 0 ? lastIdx : currentFocusInputIdx - 1
  }

  focusableInputElements[nextFocusInputIdx].click()
  focusableInputElements[nextFocusInputIdx].scrollIntoView({
    block: "center",
  })
  currentFocusInputIdx = nextFocusInputIdx
}

// view state
let showSettings = $state(false)
$effect(() => {
  // cancel listen mode when setting is closed
  if (!showSettings) modes.listenShortcutUpdate = false
})

// lifecycle
onMount(async () => {
  if (import.meta.env.MODE === "development") console.log("[onMount]")
  await chromeTabs.focusExtensionPageTabForRefresh()

  // initialize application entities
  await initializeTabIdxToInfo()
  await initializeLastFocusTabId()

  // initialize view from storage
  initializeViewFromSettings()

  // update global state
  await checkContentScriptAvailableAndUpdateAllInfo()

  if (import.meta.env.MODE === "development")
    console.log("[tabIdxToInfo]", tabIdxToInfo)

  // initialize view stuff
  setInitialFocusElemAndFocus()
  initializeFocusableInputElementsThatsAvailable()
  initializeIndexes()
})

onDestroy(() => {
  destroySettingsEffect()
})
</script>

<!-- Event Handlers -->

<svelte:document
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
        focusInitialElement: () => {
          elements.initialFocusTabItem.click()
          currentFocusInputIdx = initialFocusInputIdx
        },
        closeSettingsIfItsVisible: () => {
          if (showSettings) {
            showSettings = false
            return true
          }
          return false
        },
      })(e)
    }
  }}
  onkeyup={removeAllKeydownClass}
/>

<!-- HTML -->

<main class:large={settings.largerWidth}>
  <!-- Header Bar -->
  <header>
    <span
      >{chrome.i18n.getMessage("header_focus_initial")} :
      <button bind:this={elements.escKeyBtn} class="key">ESC</button>
    </span>
    <span
      >{chrome.i18n.getMessage("header_next")} :
      <button bind:this={elements.tabKeyBtn} class="key">Tab</button>
      /
      <button bind:this={elements.enterKeyBtn} class="key">Enter</button></span
    >
    <span>
      <span>{chrome.i18n.getMessage("header_previous")} : </span>
      <button bind:this={elements.shiftTabKeyBtn} class="key"
        >Shift + Tab</button
      >
      /
      <button bind:this={elements.shiftEnterKeyBtn} class="key"
        >Shift + Enter</button
      >
    </span>
  </header>

  <!-- TabItem List -->
  <ul bind:this={elements.ulElem}>
    {#each Object.values(tabIdxToInfo) as tabInfo, idx}
      <TabItem
        {tabInfo}
        setCurrentFocusInputIdx={() => {
          currentFocusInputIdx = idx
        }}
      />
    {/each}
  </ul>

  <GlobalToastGrid />

  <!-- Footer Bar -->
  <footer>
    <!-- Settings -->
    <div class="settingsContainer">
      <button
        type="button"
        id="settingsPopoverBtn"
        class="key pressable"
        onclick={() => {
          showSettings = !showSettings
        }}
      >
        {chrome.i18n.getMessage("settings")}
      </button>

      <!-- Popover -->
      {#if showSettings}
        <SettingsPopover
          onclose={() => {
            showSettings = false
          }}
        />
      {/if}
    </div>

    <!-- Save & Close -->
    <span>{chrome.i18n.getMessage("footer_save_and_close")} :</span>
    <button
      id="ctrlEnterBtn"
      class="key pressable"
      bind:this={elements.ctrlEnterBtn}
      onclick={apply}>Ctrl + Enter</button
    >
  </footer>
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

/* Header */

header {
  flex: 0 0 auto;

  width: 100%;
  box-sizing: border-box;
  margin-bottom: 2rem;
  border-bottom: 2px solid var(--primary-8);
  padding-bottom: 1.25rem;

  font-family: "Open Sans";
  font-size: 20px;

  display: flex;
  flex-flow: row wrap;
  justify-content: flex-end;
  column-gap: 1em;
  row-gap: 0.7em;
}

header button {
  font-size: 18px;
  padding: 0.3em 0.5em;
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

/* Footer */

footer {
  flex: 0 0 auto;

  width: 100%;
  box-sizing: border-box;
  margin-top: 2rem;
  border-top: 2px solid var(--primary-8);
  padding-top: 1rem;
  padding-right: 0.5rem;

  display: flex;
  flex-flow: row wrap;
  justify-content: flex-end;
  align-items: center;
  column-gap: 1em;

  font-family: "Open Sans";
  font-size: 20px;
}

footer button {
  font-size: 18px;
  padding: 0.6em;

  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  column-gap: 4px;
}

.settingsContainer {
  position: relative;
  margin-right: auto;
}

#settingsPopoverBtn {
  padding: 0.5em 0.4em;
  z-index: 100;

  &:hover {
    cursor: pointer;
  }
}
</style>

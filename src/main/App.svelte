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
  getLastFocusTabIdWritable,
  getRefreshAndBrowserUnavailableTabs,
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
import Key from "./components/common/Key.svelte"
import { reloadAllConnectableTabs } from "./lib/application/usecases/reloadAllConnectableTabs"

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

$effect(() => {
  console.log("[elements]", elements)
})

function setInitialFocusElemAndFocus() {
  if (import.meta.env.MODE === "development")
    console.log("[setInitialFocusElemAndFocus]")

  const lastFocusTabId = getLastFocusTabIdWritable()
  let initialTabId =
    lastFocusTabId !== null &&
    Object.values(tabIdxToInfo).filter(({ id }) => id === lastFocusTabId)[0]
      .contentScriptAvailable !== false
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

// content script unavailable tabs
let contentScriptUnavailableTabs = $derived(
  Object.values(tabIdxToInfo)
    .filter(({ contentScriptAvailable }) => !contentScriptAvailable)
    .map(({ id, title, url, status }) => ({ id, title, url, status })),
)

let { browserUnavailableTabs, refreshUnavailableTabs } = $derived.by(() => {
  const browserUnavailableTabs = []
  const refreshUnavailableTabs = []

  for (const info of contentScriptUnavailableTabs) {
    if (filterUrlsBlockedByBrowser(info.url)) {
      browserUnavailableTabs.push(info)
    } else {
      refreshUnavailableTabs.push(info)
    }
  }

  if (import.meta.env.MODE === "development") {
    console.log("{ browserUnavailableTabs, refreshUnavailableTabs }", {
      browserUnavailableTabs,
      refreshUnavailableTabs,
    })
  }

  return {
    browserUnavailableTabs,
    refreshUnavailableTabs,
  }
})

// tab status
let allTabStatus = $derived(
  Object.values(refreshUnavailableTabs).map(({ id, status }) => ({
    id,
    status,
  })),
)
let everyTabStatusIsComplete = $derived(
  allTabStatus.every(({ status }) => status === "complete"),
)

chrome.tabs.onUpdated.addListener((id, { status }, { index }) => {
  console.log("[tabs.onUpdated]", { id, status })
  tabIdxToInfo[index]["status"] = status
})

function waitUntil(getter, targetValue) {
  return new Promise((resolve) => {
    $effect.root(() => {
      $effect(() => {
        if (getter() === targetValue) {
          resolve(getter())
        }
      })
    })
  })
}

async function handleReload() {
  await reloadAllConnectableTabs()

  const tabIds = refreshUnavailableTabs.map(({ id }) => id)
  for (const [index, { contentScriptAvailable }] of Object.entries(
    tabIdxToInfo,
  )) {
    if (!contentScriptAvailable) {
      tabIdxToInfo[index]["status"] = "reloading"
    }
  }

  if (import.meta.env.MODE === "development")
    console.log("[everyTabStatusIsComplete: start]")

  await waitUntil(() => everyTabStatusIsComplete, true)

  if (import.meta.env.MODE === "development")
    console.log("[everyTabStatusIsComplete: done]")

  await initializeTabIdxToInfo()
  await checkContentScriptAvailableAndUpdateAllInfo()

  // ui
  // showUnavailableCard = true
  initializeFocusableInputElementsThatsAvailable()
  setInitialFocusElemAndFocus()
}

// unavailable card state
let showUnavailableCard = $state(true)

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

  // switch binded components into html element with <Key> component function
  elements.tabKeyBtn = elements.tabKeyBtn.getElem()
  elements.ctrlEnterBtn = elements.ctrlEnterBtn.getElem()
  elements.shiftTabKeyBtn = elements.shiftTabKeyBtn.getElem()
  elements.enterKeyBtn = elements.enterKeyBtn.getElem()
  elements.shiftEnterKeyBtn = elements.shiftEnterKeyBtn.getElem()
  elements.escKeyBtn = elements.escKeyBtn.getElem()
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
          elements.initialFocusTabItem.scrollIntoView({
            block: "center",
          })
          currentFocusInputIdx = initialFocusInputIdx
        },
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
/>

<!-- HTML -->

<main class:large={settings.largerWidth}>
  <!-- Header Bar -->
  <header>
    <span
      >{chrome.i18n.getMessage("header_focus_initial")} :
      <Key
        bind:this={elements.escKeyBtn}
        cssPressable={false}
        padding={"0.3em 0.5em"}
        onclick={() => {
          elements.initialFocusTabItem.click()
          elements.initialFocusTabItem.scrollIntoView({
            block: "center",
          })
          currentFocusInputIdx = initialFocusInputIdx
        }}
        onmousedown={() => {
          elements.escKeyBtn.classList.add("keydown")
        }}
        onmouseup={() => {
          elements.escKeyBtn.classList.remove("keydown")
        }}>ESC</Key
      >
    </span>
    <span
      >{chrome.i18n.getMessage("header_next")} :
      <Key
        bind:this={elements.tabKeyBtn}
        cssPressable={false}
        padding={"0.3em 0.5em"}
        onclick={() => {
          focusInputElement({ focusNext: true })
        }}
        onmousedown={() => {
          elements.tabKeyBtn.classList.add("keydown")
        }}
        onmouseup={() => {
          elements.tabKeyBtn.classList.remove("keydown")
        }}>Tab</Key
      >
      /
      <Key
        bind:this={elements.enterKeyBtn}
        cssPressable={false}
        padding={"0.3em 0.5em"}
        onclick={() => {
          focusInputElement({ focusNext: true })
        }}
        onmousedown={() => {
          elements.enterKeyBtn.classList.add("keydown")
        }}
        onmouseup={() => {
          elements.enterKeyBtn.classList.remove("keydown")
        }}>Enter</Key
      ></span
    >
    <span>
      <span>{chrome.i18n.getMessage("header_previous")} : </span>
      <Key
        bind:this={elements.shiftTabKeyBtn}
        cssPressable={false}
        padding={"0.3em 0.5em"}
        onclick={() => {
          focusInputElement({ focusNext: false })
        }}
        onmousedown={() => {
          elements.shiftTabKeyBtn.classList.add("keydown")
        }}
        onmouseup={() => {
          elements.shiftTabKeyBtn.classList.remove("keydown")
        }}>Shift + Tab</Key
      >
      /
      <Key
        bind:this={elements.shiftEnterKeyBtn}
        cssPressable={false}
        padding={"0.3em 0.5em"}
        onclick={() => {
          focusInputElement({ focusNext: false })
        }}
        onmousedown={() => {
          elements.shiftEnterKeyBtn.classList.add("keydown")
        }}
        onmouseup={() => {
          elements.shiftEnterKeyBtn.classList.remove("keydown")
        }}>Shift + Enter</Key
      >
    </span>
  </header>

  <!-- <pre>
    {JSON.stringify(
      { browserUnavailableTabs, refreshUnavailableTabs },
      null,
      2,
    )}
  </pre>

  <pre>
    {JSON.stringify(allTabStatus, null, 2)}
  </pre>

  <pre>
    {JSON.stringify(everyTabStatusIsComplete, null, 2)}
  </pre> -->

  <!-- Blurred Tabs Description -->
  <div id="blurDescriptionContainer">
    {#if contentScriptUnavailableTabs.length && showUnavailableCard}
      <div id="blurDescription">
        <div class="header">
          <span style:font-size="1rem">
            {chrome.i18n.getMessage("card_msg", [
              contentScriptUnavailableTabs.length,
              1 < contentScriptUnavailableTabs.length ? "s are" : " is",
            ])}
          </span>

          <div class="close containsKeyBtn">
            {chrome.i18n.getMessage("card_btn_dismiss")} : <Key
              themeReversed={true}
              largeShadow={false}
              padding={"0.4em"}
              fontSize={"15px"}
              onclick={() => {
                showUnavailableCard = false
              }}>Shift + W</Key
            >
          </div>
        </div>

        <ul>
          {#if 0 < refreshUnavailableTabs.length}
            <li>
              <p class="description">
                {chrome.i18n.getMessage("card_connectable", [
                  refreshUnavailableTabs.length,
                  1 < refreshUnavailableTabs.length ? "s" : "",
                ])} :
              </p>

              <p class="titles">
                {refreshUnavailableTabs.map(({ title }) => title).join(" , ")}
              </p>
            </li>

            <div style:text-align="right">
              <div class="right containsKeyBtn" style:padding-block="4px 3px">
                {chrome.i18n.getMessage("card_btn_reload_all")} : <Key
                  themeReversed={true}
                  largeShadow={false}
                  padding={"0.4em"}
                  fontSize={"15px"}
                  onclick={handleReload}>Shift + R</Key
                >
              </div>
            </div>
          {/if}

          {#if 0 < browserUnavailableTabs.length}
            <li>
              <p class="description">
                {chrome.i18n.getMessage("card_blocked", [
                  browserUnavailableTabs.length,
                  1 < browserUnavailableTabs.length ? "s" : "",
                ])} :
              </p>
              <p class="titles">
                {browserUnavailableTabs.map(({ title }) => title).join(" , ")}
              </p>
            </li>
          {/if}
        </ul>
      </div>
    {/if}
  </div>

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
      <Key
        id={"settingsPopoverBtn"}
        padding={""}
        onclick={() => {
          showSettings = !showSettings
        }}
      >
        {chrome.i18n.getMessage("settings")}
      </Key>

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
    <Key
      id={"ctrlEnterBtn"}
      padding={""}
      bind:this={elements.ctrlEnterBtn}
      onclick={apply}>Ctrl + Enter</Key
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
  /* margin-bottom: 2rem; */
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

:global(header button) {
  font-size: 18px;
  padding: 0.3em 0.5em;
}

/* Blurred Tabs Description */
div#blurDescriptionContainer {
  margin-block: 1rem;
}
div#blurDescription {
  /* color: var(--primary-8); */
  font-family: "Ubuntu";

  font-size: 14px;
  background: var(--primary-8);
  color: var(--bg);
  padding: 0.8em;
  padding-bottom: 1.3em;
  border-radius: 4px;

  position: relative;
  /* margin-inline: 0.7em; */
  box-shadow: 0 0 2px var(--primary-8);
}
div#blurDescription ul {
  margin-top: 0.5em;
  list-style-type: disc;
  padding-left: 1.5rem;
  /* padding-left: 2rem; */
  padding-right: 0;

  display: flex;
  flex-flow: column nowrap;
  gap: 0;

  /* font-size: 0.9em; */
}
div#blurDescription p.description {
  font-size: 15px;
  margin-bottom: 0.7em;
}
div#blurDescription p.titles {
  line-height: 1.5;
  font-size: 0.95em;
}

/* button.key.reversed {
  box-shadow: 2px 2px var(--bg);
  margin-right: 2px;
  background: var(--primary-8);
  color: var(--bg);
  border-color: var(--bg);
}
button.key.reversed:active {
  top: 2px;
  left: 2px;
  box-shadow: none;
} */

div#blurDescription div.header {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1em;
}

div#blurDescription button.key {
  font-size: 1em;
  padding: 0.4em;
}
div#blurDescription div.close {
  /* position: relati;
  top: 0;
  right: 0; */
  /* padding-top: 4px;
  padding-right: 2px; */
}
div#blurDescription div.right {
  margin-left: auto;
}
div.containsKeyBtn {
  font-size: 15px;
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

footer :global(.keyInner) {
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

:global(#settingsPopoverBtn) {
  /* padding: 0.5em 0.4em; */
  z-index: 100;

  &:hover {
    cursor: pointer;
  }
}
</style>

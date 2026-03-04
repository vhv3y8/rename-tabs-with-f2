import {
  getContentScriptUnavailableTabs,
  tabIdxToInfo,
} from "../../../application/tabInfo.svelte"
import { checkContentScriptAvailableAndUpdateAllInfo } from "../../../application/usecases/checkContentScriptAvailable"
import { initializeTabIdxToInfo } from "../../../application/usecases/initializeTabInfos"
import { reloadAllConnectableTabs } from "../../../application/usecases/reloadAllConnectableTabs"
import { focusTabItem, resetCurrentFocusInputIdx } from "./tabItems.svelte"
import { getRefreshAndBrowserUnavailableTabs } from "./unavailable.svelte"

let waitingReload = $state(false)
export function isWaitingReload() {
  return waitingReload
}
export function endWaitingReload() {
  waitingReload = false
}

// reload local state
let allReloadingTabStatus = $state({})
let everyTabStatusIsComplete = $derived(
  Object.values(allReloadingTabStatus).every(
    ({ status }) => status === "complete",
  ),
)

// tabs update listener
chrome.tabs.onUpdated.addListener((id, { status }, { index }) => {
  allReloadingTabStatus[index]["status"] = status

  if (import.meta.env.MODE === "development")
    console.log("[tabs.onUpdated]", { id, status })
})

export async function fireReload() {
  if (import.meta.env.MODE === "development")
    console.log(
      "[fireReload: getRefreshAndBrowserUnavailableTabs]",
      getRefreshAndBrowserUnavailableTabs(),
    )

  // show reloading ui
  waitingReload = true

  // initialize reload local state
  Object.assign(allReloadingTabStatus, {})
  for (const { index, id } of getContentScriptUnavailableTabs()) {
    allReloadingTabStatus[index] = {
      id,
      status: "reloading",
    }
  }

  // this just triggers reload and doesn't wait for it to end.
  // its handled by state and chrome.tabs.onUpdated.addListener above
  await reloadAllConnectableTabs()

  // wait and update ui
  await waitForReloadAndUpdateUI({})
  // retry waiting for 1 time and finish
  if (!everyTabStatusIsComplete) {
    await waitForReloadAndUpdateUI({})
  }
  endWaitingReload()
}

async function waitForReloadAndUpdateUI({ delay = 2000 }) {
  if (import.meta.env.MODE === "development")
    console.log("[everyTabStatusIsComplete: start]")

  // wait for reload to finish with time limit
  await Promise.race([
    waitUntil(() => everyTabStatusIsComplete, true),
    new Promise((res) => setTimeout(res, delay)),
  ])
  if (everyTabStatusIsComplete) endWaitingReload()

  if (import.meta.env.MODE === "development")
    console.log(
      "[everyTabStatusIsComplete] ",
      everyTabStatusIsComplete ? "[done]" : "[time limit]",
    )

  // update global state
  await checkContentScriptAvailableAndUpdateAllInfo()
  // update ui
  focusTabItem({ initial: true })
}

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

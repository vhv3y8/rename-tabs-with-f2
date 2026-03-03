import {
  getContentScriptUnavailableTabs,
  tabIdxToInfo,
} from "../../../application/tabInfo.svelte"
import { checkContentScriptAvailableAndUpdateAllInfo } from "../../../application/usecases/checkContentScriptAvailable"
import { initializeTabIdxToInfo } from "../../../application/usecases/initializeTabInfos"
import { reloadAllConnectableTabs } from "../../../application/usecases/reloadAllConnectableTabs"
import { focusTabItem, resetCurrentFocusInputIdx } from "./tabElems.svelte"
import { getRefreshAndBrowserUnavailableTabs } from "./unavailableCard.svelte"

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

chrome.tabs.onUpdated.addListener((id, { status }, { index }) => {
  if (import.meta.env.MODE === "development")
    console.log("[tabs.onUpdated]", { id, status })
  allReloadingTabStatus[index]["status"] = status
})

// debug
export function getAllReloadingTabStatus() {
  return allReloadingTabStatus
}
export function getEveryTabStatusIsComplete() {
  return everyTabStatusIsComplete
}
// debug

export async function fireReload() {
  if (import.meta.env.MODE === "development")
    console.log(
      "[fireReload: getRefreshAndBrowserUnavailableTabs]",
      getRefreshAndBrowserUnavailableTabs(),
    )

  // show reloading ui
  waitingReload = true

  // this just triggers reload and doesn't wait for it to end.
  // its handled by allTabStatus, everyTabStatusIsComplete state and chrome.tabs.onUpdated.addListener above
  await reloadAllConnectableTabs()

  // initialize by changing global state field
  // for (const [index, { contentScriptAvailable }] of Object.entries(
  //   tabIdxToInfo,
  // )) {
  //   if (!contentScriptAvailable) {
  //     tabIdxToInfo[index]["status"] = "reloading"
  //   }
  // }

  // initialize reload local state
  Object.assign(allReloadingTabStatus, {})
  for (const { index, id } of getContentScriptUnavailableTabs()) {
    allReloadingTabStatus[index] = {
      id,
      status: "reloading",
    }
  }

  if (import.meta.env.MODE === "development")
    console.log("[everyTabStatusIsComplete: start]")

  await waitForReloadAndUpdateUI({})
  // retry waiting for 1 time and finish
  if (!everyTabStatusIsComplete) {
    await waitForReloadAndUpdateUI({})
  }
  endWaitingReload()
}

async function waitForReloadAndUpdateUI({ delay = 2000 }) {
  // wait for reload to finish with time limit
  await Promise.race([
    waitUntil(() => everyTabStatusIsComplete, true),
    new Promise((res) => setTimeout(res, delay)),
  ])

  if (import.meta.env.MODE === "development")
    console.log("[everyTabStatusIsComplete: done or time limit]")

  if (everyTabStatusIsComplete) endWaitingReload()

  // update global state
  // await initializeTabIdxToInfo()
  await checkContentScriptAvailableAndUpdateAllInfo()
  focusTabItem({ initial: true })

  // ui
  // updateFocusableInputElements()
  // initializeIndexes()
  // focusInitialFocusTabItem()
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

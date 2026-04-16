import { waitUntil } from "@adapters/util.svelte"
import { notConnectedTabLists } from "./notConnected.svelte"
import { tabComponents } from "./tabComponents.svelte"
import { reloadAllConnectableTabs } from "@application/usecases/reloadAllConnectableTabs"
import { checkTabConnectionAndUpdateStoreFlags } from "@application/usecases/checkTabConnection"

type ReloadingTabStatus = {
  id: number
  status: "reloading" | "complete" | string
}
class ReloadState {
  waiting = $state(false)
  tabIdxStatusRecord: Record<number, ReloadingTabStatus> = $state({})
  allComplete: boolean
  constructor() {
    this.allComplete = $derived(
      Object.values(this.tabIdxStatusRecord).every(
        ({ status }) => status === "complete",
      ),
    )
  }
  startReload(reloadEntries: Record<number, ReloadingTabStatus>) {
    // Object.assign(this.tabIdxStatusRecord, {})
    this.waiting = true
    this.tabIdxStatusRecord = reloadEntries
  }
  // waiting
  isWaiting() {
    if (this.waiting) return true
    return false
  }
  endWaiting() {
    this.waiting = false
  }
}
export const reloadState = new ReloadState()

export async function fireReload() {
  const reloadEntries = {} as Record<number, ReloadingTabStatus>
  for (const { index, id } of notConnectedTabLists.reloadConnectableTabs) {
    if (!id) continue
    reloadEntries[index] = {
      id,
      status: "reloading",
    }
  }
  // update ui
  reloadState.startReload(reloadEntries)

  // run use case
  // this just triggers reload and doesn't wait for it to end.
  // its handled by .allComplete via chrome.tabs.onUpdated.addListener
  await reloadAllConnectableTabs()

  // wait and update ui
  if (import.meta.env.MODE === "development")
    console.log("[reload] [first wait]")
  await waitForReloadAndUpdateUI({})
  // retry waiting for 1 time and finish
  if (!reloadState.allComplete) {
    if (import.meta.env.MODE === "development")
      console.log("[reload] [second wait]")
    await waitForReloadAndUpdateUI({})
    reloadState.endWaiting()
  }
}

async function waitForReloadAndUpdateUI({ limit = 2000 }) {
  if (import.meta.env.MODE === "development")
    console.log("[reload] [everyTabStatusIsComplete: start]")

  // wait for reload to finish with time limit
  await Promise.race([
    waitUntil(() => reloadState.allComplete, true),
    new Promise((res) => setTimeout(res, limit)),
  ])
  if (reloadState.allComplete) reloadState.endWaiting()

  if (import.meta.env.MODE === "development")
    console.log(
      "[reload] [everyTabStatusIsComplete] ",
      reloadState.allComplete ? "[done]" : "[time limit]",
    )

  // run use case
  await checkTabConnectionAndUpdateStoreFlags()
  tabComponents.focusInitialItem()
}

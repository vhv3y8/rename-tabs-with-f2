import { tabItemComponents } from "./tabItemComponents.svelte"
import { reloadAllConnectableTabs } from "@application/usecases/reloadAllConnectableTabs"
import { checkTabConnectionAndUpdateStoreFlags } from "@main/application/usecases/checkAllTabConnection"
import { notConnected } from "@main/bootstrap.svelte"
import { waitUntil } from "../../util.svelte"

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
export const reload = new ReloadState()

export async function fireReload() {
  const reloadEntries = {} as Record<number, ReloadingTabStatus>
  for (const { index, id } of notConnected.reloadConnectableTabs) {
    if (!id) continue
    reloadEntries[index] = {
      id,
      status: "reloading",
    }
  }
  // update ui
  reload.startReload(reloadEntries)

  // run use case
  // this just triggers reload and doesn't wait for it to end.
  // its handled by .allComplete via chrome.tabs.onUpdated.addListener
  await reloadAllConnectableTabs()

  // wait and update ui
  if (import.meta.env.MODE === "development")
    console.log("[reload] [first wait]")
  await waitForReloadAndUpdateUI({})
  // retry waiting for 1 time and finish
  if (!reload.allComplete) {
    if (import.meta.env.MODE === "development")
      console.log("[reload] [second wait]")
    await waitForReloadAndUpdateUI({})
    reload.endWaiting()
  }
}

async function waitForReloadAndUpdateUI({ limit = 2000 }) {
  if (import.meta.env.MODE === "development")
    console.log("[reload] [everyTabStatusIsComplete: start]")

  // wait for reload to finish with time limit
  await Promise.race([
    waitUntil(() => reload.allComplete, true),
    new Promise((res) => setTimeout(res, limit)),
  ])
  if (reload.allComplete) reload.endWaiting()

  if (import.meta.env.MODE === "development")
    console.log(
      "[reload] [everyTabStatusIsComplete] ",
      reload.allComplete ? "[done]" : "[time limit]",
    )

  // run use case
  await checkTabConnectionAndUpdateStoreFlags()

  tabItemComponents.focusInitialItem()
}

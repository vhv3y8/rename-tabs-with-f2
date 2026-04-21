export type ReloadingTabStatus = {
  id: number
  status: "reloading" | "complete" | string
}
class ReloadState {
  waiting = $state(false)
  allComplete: boolean

  reloadingTabIdxStatusRecord: Record<string, ReloadingTabStatus> = $state({})
  allReloadingTabIds: number[]
  recordIdxFromTabIdLookup: Record<number, string>
  constructor() {
    this.allComplete = $derived(
      Object.values(this.reloadingTabIdxStatusRecord)
        .map(({ status }) => status)
        .every((status) => status === "complete"),
    )
    this.allReloadingTabIds = $derived(
      Object.values(this.reloadingTabIdxStatusRecord).map(({ id }) => id),
    )
    this.recordIdxFromTabIdLookup = $derived.by(() => {
      const lookup = {} as Record<number, string>
      for (const [recordIdx, { id }] of Object.entries(
        this.reloadingTabIdxStatusRecord,
      )) {
        lookup[id] = recordIdx
      }
      return lookup
    })
    $effect.root(() => {
      $effect(() => {
        console.log("[reload state] [all complete]", this.allComplete)
      })
      $effect(() => {
        console.log(
          "[reload state] [reloading tab idx -> status record update]",
          this.reloadingTabIdxStatusRecord,
        )
      })
    })
  }
  setReloadStatusEntries(reloadEntries: Record<number, ReloadingTabStatus>) {
    console.log("[setting reload status entries]")
    // Object.assign(this.reloadingTabIdxStatusRecord, {})
    this.waiting = true
    this.reloadingTabIdxStatusRecord = reloadEntries
  }
  isTabReloading(tabId: number) {
    return this.allReloadingTabIds.includes(tabId)
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

// export async function fireReload() {
//   // const reloadEntries = {} as Record<number, ReloadingTabStatus>
//   // for (const { index, id } of getInjections().notConnected
//   //   .reloadConnectableTabs) {
//   //   if (!id) continue
//   //   reloadEntries[index] = {
//   //     id,
//   //     status: "reloading",
//   //   }
//   // }
//   // update ui
//   // reload.startReload(reloadEntries)

//   // run use case
//   // this just triggers reload and doesn't wait for it to end.
//   // its handled by .allComplete via chrome.tabs.onUpdated.addListener
//   await reloadAllConnectableTabs()

//   // wait and update ui
//   if (import.meta.env.MODE === "development")
//     console.log("[reload] [first wait]")
//   await waitForReloadAndUpdateUI({})
//   // retry waiting for 1 time and finish
//   if (!reload.allComplete) {
//     if (import.meta.env.MODE === "development")
//       console.log("[reload] [second wait]")
//     await waitForReloadAndUpdateUI({})
//     reload.endWaiting()
//   }
// }

// async function waitForReloadAndUpdateUI({ limit = 2000 }) {
//   if (import.meta.env.MODE === "development")
//     console.log("[reload] [everyTabStatusIsComplete: start]")

//   // wait for reload to finish with time limit
//   await Promise.race([
//     waitUntil(() => reload.allComplete, true),
//     new Promise((res) => setTimeout(res, limit)),
//   ])
//   if (reload.allComplete) reload.endWaiting()

//   if (import.meta.env.MODE === "development")
//     console.log(
//       "[reload] [everyTabStatusIsComplete] ",
//       reload.allComplete ? "[done]" : "[time limit]",
//     )

//   // run use case
//   await checkTabConnectionAndUpdateStoreFlags()

//   tabItemComponents.focusInitialItem()
// }

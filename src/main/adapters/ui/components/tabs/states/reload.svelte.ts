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
    if (import.meta.env.MODE === "development") {
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
  }
  setReloadStatusEntries(reloadEntries: Record<number, ReloadingTabStatus>) {
    if (import.meta.env.MODE === "development")
      console.log("[setting reload status entries]")
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

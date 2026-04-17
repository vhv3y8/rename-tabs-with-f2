import type { TabInfoStore } from "@application/ports/TabInfoStore"
import type { TabInfo } from "@domain/entities/TabInfo"

export interface TabInfoState extends TabInfo {
  hasChanged: boolean
}
export class TabIdxInfoRecord implements Partial<TabInfoStore> {
  record: Record<number, TabInfoState> = $state({})

  getAllTabInfos() {
    return Object.values(this.record)
  }
  getTabInfosToApply() {
    return this.getAllTabInfos().filter(
      (tabInfo) => tabInfo.hasChanged && tabInfo.connected,
    )
  }
  getAllTabIds() {
    return Object.keys(this.record).map((key) => parseInt(key))
  }
  getById(tabId: number) {
    let filtered = this.getAllTabInfos().filter(
      ({ id }) => id === Number(tabId),
    )
    if (filtered.length === 0) return null
    else return filtered[0]
  }
  clearAndSetTabInfos(map: Record<number, TabInfo>) {
    const previous = Object.keys(map)
    const dataEntries = Object.entries(map)
    // set data
    Object.assign(this.record, map)
    // ??
    for (let i = previous.length; i < previous.length; i++) {
      delete this.record[i]
    }
  }
  setConnectedFlag(idx: number, connected: boolean) {
    const tabInfo = this.record[idx]
    if (!tabInfo) return
    tabInfo["connected"] = connected
  }
}

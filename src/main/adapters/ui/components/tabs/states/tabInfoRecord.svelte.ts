import type { TabInfoStore } from "@application/ports/TabInfoStore"
import type { TabInfo } from "@domain/entities/TabInfo"

export interface TabInfoState extends TabInfo {
  hasChanged: boolean
}
export class TabIdxInfoRecord implements Partial<TabInfoStore> {
  record: Record<number, TabInfoState> = $state({})
  constructor() {
    $effect.root(() => {
      $effect(() => {
        console.log("[tab info state record]", this.record)
      })
    })
  }

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
  clearAndSetTabInfos(tabInfos: TabInfo[]) {
    //  Record<number, TabInfo>
    const tabInfoStateRecord = tabInfos.reduce(
      (acc, { id, title, favIconUrl, url, index, status, connected }) => {
        // key have to be index. index is tab's position on current window tabs array
        acc[index] = {
          id,
          title,
          favIconUrl,
          url,
          status,
          index,
          connected,
          hasChanged: false,
        }
        return acc
      },
      {} as Record<number, TabInfoState>,
    )
    console.log("[set tab infos]", tabInfoStateRecord)
    this.record = { ...tabInfoStateRecord }
  }
  setConnectedFlag(idx: number, connected: boolean) {
    // const tabInfo = this.record[idx]
    if (!this.record[idx]) return
    console.log("[tab info store] [setting flag]", {
      tabInfo: this.record[idx],
      connected,
    })
    this.record[idx]["connected"] = connected
  }
}

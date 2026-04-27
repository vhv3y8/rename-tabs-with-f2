import type { TabInfoStore } from "@application/ports/TabInfoStore"
import type { TabInfo } from "@domain/entities/TabInfo"

export interface TabInfoState extends TabInfo {
  titleState: string
  hasChanged: boolean
}
export class TabIdxInfoRecord implements Partial<TabInfoStore> {
  record: Record<number, TabInfoState> = $state({})
  allTabInfos: TabInfoState[]
  constructor() {
    this.allTabInfos = $derived(Object.values(this.record))
    $effect.root(() => {
      $effect(() => {
        console.log("[tab info state record]", this.record)
      })
    })
  }

  getAllTabInfos() {
    return this.allTabInfos
  }
  getTabInfosToApply() {
    return this.allTabInfos
      .filter((tabInfo) => tabInfo.hasChanged && tabInfo.connected)
      .map((tabInfo) => {
        return {
          ...tabInfo,
          title: tabInfo.titleState,
        }
      })
  }
  getTitleInfosToSave() {
    // persistedTitle is not null and title is ""
    // for test
    return this.getAllTabInfos()
  }

  getById(tabId: number) {
    let filtered = this.allTabInfos.filter(({ id }) => id === Number(tabId))
    if (filtered.length === 0) return null
    else return filtered[0]
  }
  clearAndSetTabInfos(tabInfos: TabInfo[]) {
    const tabInfoStateRecord = tabInfos.reduce(
      (
        acc,
        {
          id,
          favIconUrl,
          url,
          index,
          status,
          title,
          persistedTitle,
          originalTitle,
          connected,
        },
      ) => {
        // key have to be index. index is tab's position on current window tabs array
        acc[index] = {
          id,
          favIconUrl,
          url,
          status,
          index,
          title,
          titleState: title,
          persistedTitle,
          originalTitle,
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
    if (!this.record[idx]) return
    console.log("[tab info store] [setting flag]", {
      tabInfo: this.record[idx],
      connected,
    })
    this.record[idx]["connected"] = connected
  }
}

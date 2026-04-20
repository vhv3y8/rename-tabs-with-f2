import type { ReloadLifeCycle } from "@main/application/usecases/reloadAllConnectableTabs"
import {
  reload,
  type ReloadingTabStatus,
} from "../../components/tabs/states/reload.svelte"
import { tabItemComponents } from "../../components/tabs/states/tabItemComponents.svelte"

export const ChromeSvelteReloadLifeCycle: ReloadLifeCycle = {
  beforeStart(tabIdsToReload) {
    const reloadEntries = {} as Record<number, ReloadingTabStatus>
    for (let i = 0; i < tabIdsToReload.length; i++) {
      reloadEntries[i] = {
        id: tabIdsToReload[i],
        status: "reloading",
      }
    }
    reload.setReloadStatusEntries(reloadEntries)
  },
  waitForReloadingEnd({ timeLimit = 2000 }: { timeLimit: number }) {
    return new Promise((resolve, reject) => {
      let timeLimitTimeout: ReturnType<typeof setTimeout>
      function handleReloadStateUpdate(
        tabId: number,
        { status }: chrome.tabs.TabChangeInfo,
      ) {
        if (reload.isTabReloading(tabId)) {
          console.log(
            "[reload lifecycle] [tab.onUpdated] [reloading tab update]",
            {
              tabId,
              status,
            },
          )
          const recordIdx = reload.recordIdxFromTabIdLookup[tabId]
          if (status) {
            reload.reloadingTabIdxStatusRecord[recordIdx].status = status
            if (reload.isTabReloading(tabId)) {
              console.log(
                `[reload lifecycle] [tabs.onUpdated] [updated status to "${status}"]`,
              )
            }
          }
          // all complete resolve
          if (reload.allComplete) {
            console.log(
              "[reload lifecycle] [all complete] [removing listener and resolving]",
            )
            clearTimeout(timeLimitTimeout)
            reload.endWaiting()
            resolve()
          }
        }
      }

      // register listener
      chrome.tabs.onUpdated.addListener(handleReloadStateUpdate)
      console.log("[reload lifecycle] [registered listener]")

      // time limit reject
      timeLimitTimeout = setTimeout(() => {
        console.log(
          "[reload lifecycle] [time limit ended] [removing listener and rejecting]",
        )
        // remove listener
        chrome.tabs.onUpdated.removeListener(handleReloadStateUpdate)
        reload.endWaiting()
        reject()
      }, timeLimit)
    })
  },
  afterFinish() {
    tabItemComponents.focusInitialItem()
  },
}

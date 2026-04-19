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
      function handleReloadStateUpdate(
        tabId: number,
        { status }: chrome.tabs.TabChangeInfo,
      ) {
        if (reload.isTabReloading(tabId)) {
          const recordIdx = reload.recordIdxFromTabIdLookup[tabId]
          if (status) {
            reload.reloadingTabIdxStatusRecord[recordIdx].status = status
          }
          if (reload.allComplete) {
            reload.endWaiting()
            resolve()
          }
        }
      }
      // register listener
      chrome.tabs.onUpdated.addListener(handleReloadStateUpdate)
      // set time limit
      setTimeout(() => {
        // remove listener
        chrome.tabs.onUpdated.removeListener(handleReloadStateUpdate)
        reject()
      }, timeLimit)
    })
  },
  afterFinish() {
    tabItemComponents.focusInitialItem()
  },
}

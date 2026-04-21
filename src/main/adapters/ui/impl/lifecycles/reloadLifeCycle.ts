import type { ReloadLifeCycle } from "@main/application/usecases/reloadAllConnectableTabs"
import {
  reload,
  type ReloadingTabStatus,
} from "../../components/tabs/states/reload.svelte"
import { tabItemComponents } from "../../components/tabs/states/tabItemComponents.svelte"
import type { TabInfoStore } from "@main/application/ports/TabInfoStore"
import type { CheckAllTabConnectionUseCase } from "@main/application/usecases/checkAllTabConnection"
import { waitUntil } from "../../components/util.svelte"

export function createChromeSvelteReloadLifeCycle(
  tabInfoStore: TabInfoStore,
  checkAllTabConnectionAndUpdateFlags: CheckAllTabConnectionUseCase,
): ReloadLifeCycle {
  const chromeReloadLifeCycle: ReloadLifeCycle = {
    beforeStart() {
      const tabIdsToReload = tabInfoStore.getTabIdsToReload()
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
        // register handler
        chrome.tabs.onUpdated.addListener(
          // TODO: this doesn't gets deleted and it can be problem when reload is fired multiple times
          (tabId: number, { status }: chrome.tabs.TabChangeInfo) => {
            if (reload.isTabReloading(tabId)) {
              const recordIdx = reload.recordIdxFromTabIdLookup[tabId]
              if (status) {
                reload.reloadingTabIdxStatusRecord[recordIdx].status = status
              }
              // all complete resolve
              if (reload.allComplete) {
                clearTimeout(timeLimitTimeout)
                reload.endWaiting()
                resolve()
              }
            }
          },
        )
        console.log("[reload lifecycle] [registered handler]")
        // time limit reject
        timeLimitTimeout = setTimeout(() => {
          console.log(
            "[reload lifecycle] [time limit ended] [removing listener and rejecting]",
          )
          reload.endWaiting()
          reject()
        }, timeLimit)
      })
    },
    async afterFinish() {
      console.log("[reload lifecycle] [after finish]")
      tabItemComponents.focusInitialItem()

      // wait until allComplete and update states
      if (!reload.allComplete) {
        console.log(
          "[reload lifecycle] [after finish] [not all complete] [waiting...]",
        )
        await waitUntil(() => reload.allComplete, true)
        console.log("[reload lifecycle] [after finish] [all complete!]")
        await checkAllTabConnectionAndUpdateFlags()
        console.log(
          "[reload lifecycle] [after finish] [updated flags]",
          tabInfoStore
            .getAllTabInfos()
            .map(({ title, connected }) => ({ title, connected })),
        )
        tabItemComponents.focusInitialItem()
      }
    },
  }
  return chromeReloadLifeCycle
}

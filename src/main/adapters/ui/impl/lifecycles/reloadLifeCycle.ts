import type { ReloadLifeCycle } from "@main/application/usecases/reloadAllConnectableTabs"
import {
  reload,
  type ReloadingTabStatus,
} from "../../components/tabs/states/reload.svelte"
import { tabItemComponents } from "../../components/tabs/states/tabItemComponents.svelte"
import { waitUntil } from "../../components/util.svelte"
import type { TabInfoStore } from "@main/application/ports/TabInfoStore"
import type { CheckAllTabConnectionUseCase } from "@main/application/usecases/checkAllTabConnection"

// export const ChromeSvelteReloadLifeCycle: ReloadLifeCycle = {
//   beforeStart(tabIdsToReload) {
//     const reloadEntries = {} as Record<number, ReloadingTabStatus>
//     for (let i = 0; i < tabIdsToReload.length; i++) {
//       reloadEntries[i] = {
//         id: tabIdsToReload[i],
//         status: "reloading",
//       }
//     }
//     reload.setReloadStatusEntries(reloadEntries)
//   },
//   waitForReloadingEnd({ timeLimit = 2000 }: { timeLimit: number }) {
//     return new Promise((resolve, reject) => {
//       let timeLimitTimeout: ReturnType<typeof setTimeout>

//       function handleReloadStateUpdate(
//         tabId: number,
//         { status }: chrome.tabs.TabChangeInfo,
//       ) {
//         if (reload.isTabReloading(tabId)) {
//           console.log(
//             "[reload lifecycle] [tab.onUpdated] [reloading tab update]",
//             {
//               tabId,
//               status,
//             },
//           )
//           const recordIdx = reload.recordIdxFromTabIdLookup[tabId]
//           if (status) {
//             reload.reloadingTabIdxStatusRecord[recordIdx].status = status
//             if (reload.isTabReloading(tabId)) {
//               console.log(
//                 `[reload lifecycle] [tabs.onUpdated] [updated status to "${status}"]`,
//               )
//             }
//           }
//           // all complete resolve
//           if (reload.allComplete) {
//             console.log(
//               "[reload lifecycle] [all complete] [removing listener and resolving]",
//             )
//             clearTimeout(timeLimitTimeout)
//             reload.endWaiting()
//             resolve()
//           }
//         }
//       }

//       // register listener
//       chrome.tabs.onUpdated.addListener(handleReloadStateUpdate)
//       console.log("[reload lifecycle] [registered listener]")
//       // time limit reject
//       timeLimitTimeout = setTimeout(() => {
//         console.log(
//           "[reload lifecycle] [time limit ended] [removing listener and rejecting]",
//         )
//         // remove listener
//         chrome.tabs.onUpdated.removeListener(handleReloadStateUpdate)
//         reload.endWaiting()
//         reject()
//       }, timeLimit)
//     })
//   },
//   afterFinish() {
//     tabItemComponents.focusInitialItem()

//     // wait until allComplete and update states
//     if (!reload.allComplete) {
//       waitUntil(() => reload.allComplete, true).then(() => {
//         checkAllTabConnectionAndUpdateFlags()
//       })
//     }
//   },
// }

export function createChromeReloadLifeCycle(
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

        function handleReloadStateUpdate(
          tabId: number,
          { status }: chrome.tabs.TabChangeInfo,
        ) {
          if (reload.isTabReloading(tabId)) {
            const recordIdx = reload.recordIdxFromTabIdLookup[tabId]
            console.log(
              "[reload lifecycle] [tab.onUpdated] [reloading tab update]",
              {
                tabId,
                status,
                recordIdx,
                recordItem: reload.reloadingTabIdxStatusRecord[recordIdx],
              },
            )
            if (status) {
              reload.reloadingTabIdxStatusRecord[recordIdx].status = status
              if (reload.isTabReloading(tabId)) {
                console.log(
                  `[reload lifecycle] [tabs.onUpdated] [updated status to "${status}"]`,
                )
              }
              //
              console.log(
                `[reload lifecycle] [tabs.onUpdated] [reloading tabs statuses]`,
                Object.values(reload.reloadingTabIdxStatusRecord).map(
                  ({ status }) => status,
                ),
                Object.values(reload.reloadingTabIdxStatusRecord)
                  .map(({ status }) => ({ status }))
                  .every(({ status }) => status === "complete"),
                { all_complete: reload.allComplete },
              )
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
          // chrome.tabs.onUpdated.removeListener(handleReloadStateUpdate)
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
        // await waitUntil(() => reload.allComplete, true)
        await waitUntil(
          () =>
            Object.values(reload.reloadingTabIdxStatusRecord)
              .map(({ status }) => status)
              .every((status) => status === "complete"),
          true,
        )
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

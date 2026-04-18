import type { PlatformMainFacade } from "@main/application/ports/PlatformMainFacade"
import type { ReloadLifeCycle } from "@main/application/usecases/reloadAllConnectableTabs"

export const ChromeSvelteReloadLifeCycle: ReloadLifeCycle = {
  beforeStart() {
    //  reload.startReload(reloadEntries)
  },
  waitForReloadingEnd(options: { timeLimit: number; wait: number }) {
    // maybe other approach is possible because of registering chrome.tabs.onUpdated.addListener here
    // // wait for reload to finish with time limit
    // await Promise.race([
    //   waitUntil(() => reload.allComplete, true),
    //   new Promise((res) => setTimeout(res, limit)),
    // ])
    // if (reload.allComplete) reload.endWaiting()
  },
  afterFinish() {
    // tabItemComponents.focusInitialItem()
  },
}

// export function createReloadLifeCycleImpl(
//   extensionFacade: PlatformMainFacade,
// ): ReloadLifeCycle {
//   const ReloadLifeCycleImpl: ReloadLifeCycle = {
//     beforeStart() {},
//     waitForReloadingEnd(options: { timeLimit: number; wait: number }) {},
//     afterFinish() {},
//   }
//   return ReloadLifeCycleImpl
// }

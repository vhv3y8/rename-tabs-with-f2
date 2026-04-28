import type { PlatformMainFacade } from "../ports/infra/PlatformMainFacade"
import type { TabInfoStore } from "../ports/TabInfoStore"
import type { CheckAllTabConnectionUseCase } from "./checkAllTabConnection"

export interface ReloadLifeCycle {
  beforeStart?(tabIdsToReload: number[]): void
  // at other environment, fire and wait can be provided as single operation.
  waitForReloadingEnd?(options?: { timeLimit?: number }): Promise<void>
  afterFinish?(): Promise<void>
}
export type ReloadAllConnectableTabsUseCase = ReturnType<
  typeof createReloadAllConnectableTabs
>

export function createReloadAllConnectableTabs(
  tabInfoStore: TabInfoStore,
  extensionFacade: PlatformMainFacade,
  checkAllTabConnectionAndUpdateFlags: CheckAllTabConnectionUseCase,
  lifeCycle: ReloadLifeCycle,
) {
  return async function reloadAllConnectableTabs() {
    const tabIdsToReload = tabInfoStore.getTabIdsToReload()
    lifeCycle.beforeStart?.(tabIdsToReload)
    if (import.meta.env.MODE === "development")
      console.log("[reload] [before start]")

    // fire reload and wait
    await Promise.all(
      tabIdsToReload.map((tabId) => extensionFacade.reloadTab({ tabId })),
    )
    if (import.meta.env.MODE === "development")
      console.log("[reload] [triggered]")

    await lifeCycle
      .waitForReloadingEnd?.({ timeLimit: 3000 })
      .catch((reason) => {
        // ended by time limit, not all complete
      })
    if (import.meta.env.MODE === "development")
      console.log("[reload] [waiting ended]")

    // check connection and update store flags
    await checkAllTabConnectionAndUpdateFlags()
    if (import.meta.env.MODE === "development")
      console.log("[reload] [updated flags]")

    await lifeCycle.afterFinish?.()
  }
}

import type { PlatformMainFacade } from "../ports/PlatformMainFacade"
import type { TabInfoStore } from "../ports/TabInfoStore"
import type { CheckAllTabConnectionUseCase } from "./checkAllTabConnection"

export interface ReloadLifeCycle {
  beforeStart?(): void
  // at other environment, fire and wait can be provided as single operation.
  waitForReloadingEnd?(options: Partial<{ timeLimit: number }>): Promise<void>
  afterFinish?(): void
}
export type ReloadAllConnectableTabsUseCase = ReturnType<
  typeof createReloadAllConnectableTabs
>

export function createReloadAllConnectableTabs(
  lifeCycle: ReloadLifeCycle,
  tabInfoStore: TabInfoStore,
  extensionFacade: PlatformMainFacade,
  checkAllTabConnectionAndUpdateFlags: CheckAllTabConnectionUseCase,
) {
  return async function reloadAllConnectableTabs() {
    const tabIdsToReload = tabInfoStore.getTabIdsToReload()
    lifeCycle.beforeStart?.()

    // fire reload and wait
    await Promise.all(
      tabIdsToReload.map((tabId) => extensionFacade.reloadTab({ tabId })),
    )
    await lifeCycle.waitForReloadingEnd?.({})

    // check connection and update store flags
    await checkAllTabConnectionAndUpdateFlags()
    lifeCycle.afterFinish?.()
  }
}

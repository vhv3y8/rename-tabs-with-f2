import { type ChromeMainFacade } from "@main/infra/platform/impl/ChromeMainFacade2"
import type { TabInfoStore } from "../ports/TabInfoStore"
import { checkAllTabConnectionAndUpdateFlags } from "./checkAllTabConnection"

export interface ReloadLifeCycle {
  beforeStart?(): void
  // at other environment, fire and wait can be provided as single operation.
  waitForReloadingEnd?(options: {
    timeLimit: number
    // ??
    wait: number
  }): Promise<void>
  afterFinish?(): void
}

export type ReloadAllConnectableTabsUseCase = ReturnType<
  typeof createReloadAllConnectableTabs
>
export function createReloadAllConnectableTabs(
  lifeCycle: ReloadLifeCycle,
  tabInfoStore: TabInfoStore,
  chromeFacade: ChromeMainFacade,
) {
  return async function reloadAllConnectableTabs() {
    const tabIdsToReload = tabInfoStore.getTabIdsToReload()
    lifeCycle.beforeStart?.()

    // fire reload and wait
    await Promise.all(tabIdsToReload.map((id) => chromeFacade.reloadTab(id)))
    await lifeCycle.waitForReloadingEnd?.({ timeLimit: 2000, wait: 2 })

    // check connection and update store flags
    await checkAllTabConnectionAndUpdateFlags()
    lifeCycle.afterFinish?.()
  }
}

// export async function reloadAllConnectableTabs(tabIdsToReload: number[]) {
//   // const tabIdsToReload = notConnectedTabLists.reloadConnectableTabs.map(
//   //   ({ id }) => id,
//   // )
//   return Promise.all(
//     tabIdsToReload.map((id) => ChromeMainFacadeImpl.reloadTab(id)),
//   )

//   // wait for listener and return

//   //
//   // await checkTabConnectionAndUpdateStoreFlags()
// }

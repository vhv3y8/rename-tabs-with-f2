import { ChromeMainFacadeImpl } from "@infra/ChromeMainFacade"

export async function reloadAllConnectableTabs(tabIdsToReload: number[]) {
  // const tabIdsToReload = notConnectedTabLists.reloadConnectableTabs.map(
  //   ({ id }) => id,
  // )
  return Promise.all(
    tabIdsToReload.map((id) => ChromeMainFacadeImpl.reloadTab(id)),
  )
}

// wait for listener and return

import { notConnectedTabLists } from "@adapters/tabs/states/notConnected.svelte"
import { ChromeMainFacadeImpl } from "@infra/ChromeMainFacade"

export async function reloadAllConnectableTabs() {
  const tabIdsToReload = notConnectedTabLists.reloadConnectableTabs.map(
    ({ id }) => id,
  )
  return Promise.all(
    tabIdsToReload.map((id) => ChromeMainFacadeImpl.reloadTab(id)),
  )
}

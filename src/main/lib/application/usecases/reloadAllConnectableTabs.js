import * as chromeTabs from "$$lib/chrome/tabs"
import { getRefreshAndBrowserUnavailableTabs } from "../../ui/states/tabs/unavailableCard.svelte"

export async function reloadAllConnectableTabs() {
  const { refreshUnavailableTabs } = getRefreshAndBrowserUnavailableTabs()
  const tabIdsToReload = refreshUnavailableTabs.map(({ id }) => id)
  return Promise.all(tabIdsToReload.map((id) => chromeTabs.reloadTab(id)))
}

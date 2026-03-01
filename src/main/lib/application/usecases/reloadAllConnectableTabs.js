import * as chromeTabs from "$$lib/chrome/tabs"
import { getRefreshAndBrowserUnavailableTabs } from "../tabInfo.svelte"

export async function reloadAllConnectableTabs() {
  const { refreshUnavailableTabs } = getRefreshAndBrowserUnavailableTabs()
  const tabIdsToReload = refreshUnavailableTabs.map(({ id }) => id)
  await Promise.all(tabIdsToReload.map((id) => chromeTabs.reloadTab(id)))
}

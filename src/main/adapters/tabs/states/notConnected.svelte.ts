import type { TabInfo } from "@domain/entities/TabInfo"
import type { TabInfoStore } from "@application/ports/TabInfoStore"
import { tabIdxInfoStore } from "../impl/tabInfo.svelte"

const browserPolicyBlockedURLFilters = [
  /chrome:\/\/.*/i,
  /chrome-extension:\/\/.*/i,
  /https:\/\/chrome.google.com\/webstore\/.*/i,
  /https:\/\/chromewebstore.google.com\/.*/i,
]
function isBrowserPolicyBlockedURL(url: string) {
  return browserPolicyBlockedURLFilters.some((filter) => filter.test(url))
}

type NotConnectedTab = Pick<TabInfo, "id" | "title" | "url" | "index">
class NotConnectedTabLists {
  allTabs: NotConnectedTab[]
  policyBlockedTabs: NotConnectedTab[]
  reloadConnectableTabs: NotConnectedTab[]
  constructor(private tabInfoStore: TabInfoStore) {
    this.allTabs = $derived(
      Object.values(this.tabInfoStore)
        .filter(({ connected }) => !connected)
        .map(({ id, title, url, index }) => ({ id, title, url, index })),
    )
    this.policyBlockedTabs = $derived(
      this.allTabs.filter(({ url }) => url && isBrowserPolicyBlockedURL(url)),
    )
    this.reloadConnectableTabs = $derived(
      this.allTabs.filter(({ url }) => url && !isBrowserPolicyBlockedURL(url)),
    )
  }
}
export const notConnectedTabLists = new NotConnectedTabLists(tabIdxInfoStore)

class NotConnectedCardState {
  show = $state(true)
  hideCardIfVisible() {
    if (this.show) this.show = false
  }
}
export const notConnectedCardState = new NotConnectedCardState()

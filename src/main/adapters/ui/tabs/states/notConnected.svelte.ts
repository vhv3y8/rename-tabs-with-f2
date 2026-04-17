import type { TabInfo } from "@domain/entities/TabInfo"
import type { TabInfoStore } from "@application/ports/TabInfoStore"

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
export class NotConnectedTabLists implements Partial<TabInfoStore> {
  allTabs: NotConnectedTab[]
  policyBlockedTabs: NotConnectedTab[]
  reloadConnectableTabs: NotConnectedTab[]
  constructor(private tabInfoStore: TabInfoStore) {
    this.allTabs = $derived(
      Object.values(this.tabInfoStore.getAllTabInfos())
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
  getTabIdsToReload() {
    return this.reloadConnectableTabs
      .map(({ id }) => id)
      .filter((id) => id !== undefined)
  }
}

class NotConnectedCardState {
  show = $state(true)
  hideCardIfVisible() {
    if (this.show) this.show = false
  }
}
export const notConnectedCard = new NotConnectedCardState()

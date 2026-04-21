import type { TabInfoStore } from "@application/ports/TabInfoStore"
import type { TabInfoState } from "./tabInfoRecord.svelte"

const browserPolicyBlockedURLFilters = [
  /chrome:\/\/.*/i,
  /chrome-extension:\/\/.*/i,
  /https:\/\/chrome.google.com\/webstore\/.*/i,
  /https:\/\/chromewebstore.google.com\/.*/i,
]
function isBrowserPolicyBlockedURL(url: string) {
  return browserPolicyBlockedURLFilters.some((filter) => filter.test(url))
}

type NotConnectedTabInfo = Pick<TabInfoState, "id" | "title" | "url" | "index">
export class NotConnectedTabInfoLists implements Partial<TabInfoStore> {
  allTabs: NotConnectedTabInfo[]
  policyBlockedTabs: NotConnectedTabInfo[]
  reloadConnectableTabs: NotConnectedTabInfo[]
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
    $effect.root(() => {
      $effect(() => {
        console.log("[not connected] [all tabs]", this.allTabs)
      })
      $effect(() => {
        console.log("[not connected] [policy tabs]", this.policyBlockedTabs)
      })
      $effect(() => {
        console.log("[not connected] [reload tabs]", this.reloadConnectableTabs)
      })
    })
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

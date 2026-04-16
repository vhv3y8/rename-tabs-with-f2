import type { TabInfoStore } from "@application/ports/TabInfoStore"
import type TabItem from "../TabItem.svelte"
import { tabIdxInfoStore } from "../impl/tabInfo.svelte"

type TabItemComponent = ReturnType<typeof TabItem>
export class TabComponents {
  private components: TabItemComponent[] = $state([])
  private lastFocusTabId: number | null = null
  private currentFocusInputIdx: number | null = $state(null)

  private focusableComponents: TabItemComponent[]
  private initialFocusInputIdx: number
  constructor(private tabIdxInfoStore: TabInfoStore) {
    this.focusableComponents = $derived(
      this.components.filter((elem) => elem.isContentScriptConnected()),
    )
    this.initialFocusInputIdx = $derived.by(() => {
      if (this.lastFocusTabId === null) return 0
      const lastFocusTabInfo = this.tabIdxInfoStore.getById(this.lastFocusTabId)
      if (lastFocusTabInfo?.connected) {
        return findFocusableItemsIdxFromTabId(lastFocusTabId)
      }
      return 0
    })
  }
  //
  getLastFocusTabId() {
    return this.lastFocusTabId
  }
  setLastFocusTabId(tabId: number) {
    this.lastFocusTabId = tabId
  }
  //
  updateCurrentFocusIdx(idx: number) {
    this.currentFocusInputIdx = idx
  }
  // focus items
  focusNextItem() {}
  focusPreviousItem() {}
  focusInitialItem() {}
  focusCurrentItem() {}
}
//
export const tabComponents = new TabComponents(tabIdxInfoStore)

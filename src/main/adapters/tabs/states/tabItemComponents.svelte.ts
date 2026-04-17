import type { TabInfoStore } from "@application/ports/TabInfoStore"
import type TabItem from "../TabItem.svelte"
import { tabIdxInfoStore } from "../impl/tabInfo.svelte"
import { ChromeMainFacadeImpl } from "@infra/ChromeMainFacade"

type TabItemComponent = ReturnType<typeof TabItem>
export class TabItemComponents {
  // components are set by <TabItem> bind:this
  components: TabItemComponent[] = $state([])
  private focusableComponents: TabItemComponent[]
  focusableIdxFromTabIdLookup: Record<number, number>

  private currentFocusInputIdx: number
  private initialFocusInputIdx: number
  private constructor(
    private tabIdxInfoStore: TabInfoStore,
    private lastFocusTabId: number | null = null,
  ) {
    // components related
    this.focusableComponents = $derived(
      this.components.filter((elem) => elem.isContentScriptConnected()),
    )
    this.focusableIdxFromTabIdLookup = $derived.by(() => {
      let record = {} as Record<number, number>
      for (const [focusableIdx, { tabId }] of Object.entries(
        this.focusableComponents,
      )) {
        record[tabId()] = Number(focusableIdx)
      }
      return record
    })
    // indexes
    this.initialFocusInputIdx = $derived.by(() => {
      if (this.lastFocusTabId === null) return 0
      const lastFocusTabInfo = this.tabIdxInfoStore.getById(this.lastFocusTabId)
      if (lastFocusTabInfo?.connected) {
        return this.focusableIdxFromTabIdLookup[this.lastFocusTabId]
      }
      return 0
    })
    this.currentFocusInputIdx = $state(this.initialFocusInputIdx)
    $effect.root(() => {
      $effect(() => {
        this.currentFocusInputIdx = this.initialFocusInputIdx
      })
    })
  }
  // use this method to create instance
  static async build(tabIdxInfoStore: TabInfoStore) {
    const lastFocusTabId = await ChromeMainFacadeImpl.getLastFocusTabId()
    return new TabItemComponents(tabIdxInfoStore, lastFocusTabId)
  }

  // mouse click
  updateCurrentFocusIdx(idx: number) {
    this.currentFocusInputIdx = idx
  }
  // focus items
  focusNextItem() {
    if (0 < this.focusableComponents.length) {
      const endIdx = this.focusableComponents.length - 1
      const focusIdx =
        this.currentFocusInputIdx === endIdx ? 0 : this.currentFocusInputIdx + 1
      this.focusableComponents[focusIdx].focusTabInput()
      this.currentFocusInputIdx = focusIdx
    }
  }
  focusPreviousItem() {
    if (0 < this.focusableComponents.length) {
      const focusIdx =
        this.currentFocusInputIdx === 0
          ? this.focusableComponents.length
          : this.currentFocusInputIdx - 1
      this.focusableComponents[focusIdx].focusTabInput()
      this.currentFocusInputIdx = focusIdx
    }
  }
  focusInitialItem() {
    if (0 < this.focusableComponents.length) {
      this.focusableComponents[this.initialFocusInputIdx].focusTabInput()
    }
  }
  focusCurrentItem() {
    if (0 < this.focusableComponents.length) {
      this.focusableComponents[this.currentFocusInputIdx].focusTabInput()
    }
  }
}
//
export const tabItemComponents = await TabItemComponents.build(tabIdxInfoStore)

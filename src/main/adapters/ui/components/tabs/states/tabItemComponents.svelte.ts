import type TabItem from "../TabItem.svelte"

type TabItemComponent = ReturnType<typeof TabItem>
export class TabItemComponents {
  // components are set by <TabItem> bind:this
  components: TabItemComponent[] = $state([])
  private focusableComponents: TabItemComponent[]
  focusableIdxFromTabIdLookup: Record<number, number>

  private lastFocusTabId: number = $state(-1)
  private currentFocusInputIdx: number
  private initialFocusInputIdx: number
  constructor() {
    // components related
    this.focusableComponents = $derived(
      this.components.filter((elem) => elem.isContentScriptConnected()),
    )
    this.focusableIdxFromTabIdLookup = $derived.by(() => {
      let record = {} as Record<number, number>
      for (const [focusableIdx, { getTabId }] of Object.entries(
        this.focusableComponents,
      )) {
        record[getTabId()] = Number(focusableIdx)
      }
      return record
    })
    // indexes
    this.initialFocusInputIdx = $derived.by(() => {
      const lastFocusTabIdx =
        this.focusableIdxFromTabIdLookup[this.lastFocusTabId]
      console.log(
        "[last focus tab id]",
        this.lastFocusTabId,
        "[lastFocusTabIdx]",
        lastFocusTabIdx,
      )
      if (lastFocusTabIdx) return lastFocusTabIdx
      else return 0
    })
    this.currentFocusInputIdx = $state(this.initialFocusInputIdx)
    $effect.root(() => {
      $effect(() => {
        this.currentFocusInputIdx = this.initialFocusInputIdx
      })
    })
    $effect.root(() => {
      $effect(() => {
        console.log(
          "[focusable components update] [focusableIdxFromTabIdLookup]",
          this.focusableIdxFromTabIdLookup,
        )
      })
      $effect(() => {
        console.log(
          "[focusable components update] [tab infos]",
          this.focusableComponents.map(({ getTabInfo }) => {
            const { id, index, title } = getTabInfo()
            return { id, index, title }
          }),
        )
      })
      $effect(() => {
        console.log(
          "[focusable initial focus input idx update]",
          this.initialFocusInputIdx,
        )
      })
      $effect(() => {
        console.log(
          "[focusable current focus input idx update]",
          this.currentFocusInputIdx,
        )
      })
    })
  }
  setLastFocusTabIdForInitialFocus(lastFocusTabId: number) {
    this.lastFocusTabId = lastFocusTabId
    // index changes are triggered by effect
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
          ? this.focusableComponents.length - 1
          : this.currentFocusInputIdx - 1
      this.focusableComponents[focusIdx].focusTabInput()
      this.currentFocusInputIdx = focusIdx
    }
  }
  focusInitialItem() {
    console.log("[focus initial item]", {
      length: this.focusableComponents.length,
      initialIdx: this.initialFocusInputIdx,
      component: this.focusableComponents[this.initialFocusInputIdx],
    })
    if (0 < this.focusableComponents.length) {
      this.focusableComponents[this.initialFocusInputIdx].focusTabInput()
    }
  }
  focusCurrentItem() {
    console.log("[focus initial item]", {
      length: this.focusableComponents.length,
      currentIdx: this.currentFocusInputIdx,
      component: this.focusableComponents[this.currentFocusInputIdx],
    })
    if (0 < this.focusableComponents.length) {
      this.focusableComponents[this.currentFocusInputIdx].focusTabInput()
    }
  }
}
//
export const tabItemComponents = new TabItemComponents()

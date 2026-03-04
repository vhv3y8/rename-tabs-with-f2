import {
  getLastFocusTabId,
  tabIdxToInfo,
} from "../../../application/tabInfo.svelte"

// focusable svelte components given by bind:this
export let allTabItems = $state([])
let focusableTabItems = $derived(
  allTabItems.filter((elem) => elem.isContentScriptAvailable()),
)

if (import.meta.env.MODE === "development") {
  $effect.root(() => {
    $effect(() => {
      console.log(
        "[allTabItems]",
        allTabItems.map((item) => item.getTabInfo().title),
      )
    })
    $effect(() => {
      console.log(
        "[focusableTabItems]",
        focusableTabItems.map((item) => item.getTabInfo().title),
      )
    })
  })
}

// focus indexes state
let currentFocusInputIdx = $state(null)
let initialFocusInputIdx = $derived.by(() => {
  const lastFocusTabId = getLastFocusTabId()
  if (lastFocusTabId === -1) return 0

  const lastFocusTabInfo = Object.values(tabIdxToInfo).find(
    ({ id }) => id === lastFocusTabId,
  )
  if (lastFocusTabInfo.contentScriptAvailable) {
    return findFocusableItemsIdxFromTabId(lastFocusTabId)
  }
  return 0
})

export function findFocusableItemsIdxFromTabId(tabIdToFind) {
  for (let i = 0; i < focusableTabItems.length; i++) {
    console.log(
      "[findFocusableItemsIdxFromTabId] [focusableTabItems[i].tabId()]",
      focusableTabItems[i].tabId(),
    )
    if (focusableTabItems[i].tabId() === tabIdToFind) {
      return i
    }
  }
  return 0
}

export function setCurrentFocusIdxFromClick(idx) {
  currentFocusInputIdx = idx
}

let initialFocusTabItem = $derived(
  focusableTabItems.length === 0 || initialFocusInputIdx === -1
    ? null
    : focusableTabItems[initialFocusInputIdx],
)

if (import.meta.env.MODE === "development") {
  $effect.root(() => {
    $effect(() => {
      console.log("[initialFocusInputIdx]", initialFocusInputIdx)
    })
    $effect(() => {
      console.log("[currentFocusInputIdx]", currentFocusInputIdx)
    })
    $effect(() => {
      console.log("[initialFocusTabItem]", initialFocusTabItem.getTabInfo())
    })
  })
}

// focus initial, next, previous tab item
export function focusTabItem({
  initial = false,
  next = true,
  current = false,
}) {
  const lastIdx = Object.keys(focusableTabItems).length - 1

  let idxToFocus
  if (initial) {
    // initial
    idxToFocus = initialFocusInputIdx
    if (import.meta.env.MODE === "development")
      console.log("[focusTabItem] [initialFocusInputIdx]", initialFocusInputIdx)
  } else if (current) {
    // current
    idxToFocus = currentFocusInputIdx
  } else if (next) {
    // next
    idxToFocus = currentFocusInputIdx === lastIdx ? 0 : currentFocusInputIdx + 1
  } else {
    // previous
    idxToFocus = currentFocusInputIdx === 0 ? lastIdx : currentFocusInputIdx - 1
  }

  if (import.meta.env.MODE === "development")
    console.log(
      "[focusTabItem] [focusableTabItems]",
      focusableTabItems.map((item) => item.getTabInfo()),
      focusableTabItems[idxToFocus],
    )
  focusableTabItems[idxToFocus].focusTabInput()
  currentFocusInputIdx = idxToFocus
}

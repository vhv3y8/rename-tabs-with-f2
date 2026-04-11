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
        "[tabItems] [effect] [allTabItems]",
        allTabItems.map((item) => item.getTabInfo().title),
      )
    })
    $effect(() => {
      console.log(
        "[tabItems] [effect] [focusableTabItems]",
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

  if (import.meta.env.MODE === "development") {
    console.log(
      "[tabItems] [initialFocusInputIdx derived.by] [lastFocusTabId]",
      lastFocusTabId,
    )
  }

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
      "[tabItems] [findFocusableItemsIdxFromTabId] [focusableTabItems[i].tabId()]",
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
      console.log(
        "[tabItems] [effect] [initialFocusInputIdx]",
        initialFocusInputIdx,
      )
    })
    $effect(() => {
      console.log(
        "[tabItems] [effect] [currentFocusInputIdx]",
        currentFocusInputIdx,
      )
    })
    $effect(() => {
      console.log(
        "[tabItems] [effect] [initialFocusTabItem]",
        initialFocusTabItem,
        initialFocusTabItem?.getTabInfo(),
      )
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
  if (lastIdx === -1) return

  let idxToFocus
  if (initial) {
    // initial
    idxToFocus = initialFocusInputIdx
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

  if (import.meta.env.MODE === "development") {
    console.log("[tabItems] [focusTabItem] [idxToFocus]", idxToFocus)
    console.log(
      "[tabItems] [focusTabItem] [focusableTabItems[idxToFocus].getTabInfo()]",
      focusableTabItems[idxToFocus].getTabInfo(),
    )
  }

  if (0 < focusableTabItems.length) {
    focusableTabItems[idxToFocus].focusTabInput()
    currentFocusInputIdx = idxToFocus
  }
}

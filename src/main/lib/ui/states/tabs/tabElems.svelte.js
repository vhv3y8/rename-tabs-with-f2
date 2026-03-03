import {
  getLastFocusTabId,
  tabIdxToInfo,
} from "../../../application/tabInfo.svelte"

// focusable svelte components given by bind:this
export let allTabItems = $state([])
let focusableTabItems = $derived(
  allTabItems.filter((elem) => elem.isContentScriptAvailable()),
)
// export function getFocusableTabItems() {
//   return focusableTabItems
// }

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

// focus indexes state
let currentFocusInputIdx = $state(null)
let initialFocusInputIdx = $derived.by(() => {
  const lastFocusTabId = getLastFocusTabId()
  console.log("[initialFocusInputIdx] [lastFocusTabId]", lastFocusTabId)
  if (lastFocusTabId === -1) return 0

  const lastFocusTabInfo = Object.values(tabIdxToInfo).find(
    ({ id }) => id === lastFocusTabId,
  )
  console.log("[initialFocusInputIdx] [lastFocusTabInfo]", lastFocusTabInfo)

  if (lastFocusTabInfo.contentScriptAvailable) {
    for (let i = 0; i < focusableTabItems.length; i++) {
      console.log(
        "[initialFocusInputIdx] [focusableTabItems[i].tabId()]",
        focusableTabItems[i].tabId(),
      )
      if (focusableTabItems[i].tabId() === lastFocusTabId) {
        return i
      }
    }
  }
  return 0
})

$effect.root(() => {
  $effect(() => {
    console.log("[initialFocusInputIdx]", initialFocusInputIdx)
  })
  $effect(() => {
    console.log("[currentFocusInputIdx]", currentFocusInputIdx)
  })
})

// export function resetCurrentFocusInputIdx() {
//   currentFocusInputIdx = initialFocusInputIdx

//   if (import.meta.env.MODE === "development") {
//     console.log("[resetCurrentFocusInputIdx] to ", initialFocusInputIdx)
//   }
// }

let initialFocusTabItem = $derived(
  focusableTabItems.length === 0 || initialFocusInputIdx === -1
    ? null
    : focusableTabItems[initialFocusInputIdx],
)

// if (import.meta.env.MODE === "development") {
//   $effect.root(() => {
//     $effect(() => {
//       console.log("[initialFocusTabItem]", initialFocusTabItem.getTabInfo())
//     })
//   })
// }

if (import.meta.env.MODE === "development") {
  $effect.root(() => {
    $effect(() => {
      console.log("[currentFocusInputIdx]", currentFocusInputIdx)
    })
    $effect(() => {
      console.log("[initialFocusInputIdx]", initialFocusInputIdx)
    })
  })
}

export function focusTabItem({ initial = false, next = true }) {
  const lastIdx = Object.keys(focusableTabItems).length - 1

  let idxToFocus
  if (initial) {
    // initial
    idxToFocus = initialFocusInputIdx
    if (import.meta.env.MODE === "development")
      console.log("[initialFocusInputIdx]", initialFocusInputIdx)
  } else if (next) {
    // next
    idxToFocus = currentFocusInputIdx === lastIdx ? 0 : currentFocusInputIdx + 1
  } else {
    // previous
    idxToFocus = currentFocusInputIdx === 0 ? lastIdx : currentFocusInputIdx - 1
  }

  if (import.meta.env.MODE === "development")
    console.log(
      "[focusableTabItems]",
      focusableTabItems.map((item) => item.getTabInfo()),
      focusableTabItems[idxToFocus],
    )
  focusableTabItems[idxToFocus].focusTabInput()
  currentFocusInputIdx = idxToFocus
}

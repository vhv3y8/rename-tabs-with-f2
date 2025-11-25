import { writable } from "svelte/store"

// Tab info
export let tabIdxToInfo = $state({})

export function resetTabIdxToInfo(data) {
  // empty
  Object.keys(tabIdxToInfo).forEach((k) => delete tabIdxToInfo[k])
  // set data
  for (const [idx, info] of Object.entries(data)) {
    tabIdxToInfo[idx] = info
  }
}

export function getTabInfoById(tabId) {
  let filtered = Object.values(tabIdxToInfo).filter(
    ({ id }) => id === Number(tabId),
  )
  return filtered.length === 0 ? null : filtered[0]
}

// Last focus tab id
// reassignment is not available with runes state
let lastFocusTabId = writable(-1)

export function getLastFocusTabIdWritable() {
  let val
  lastFocusTabId.subscribe((v) => (val = v))()
  return val
}

export function setLastFocusTabIdWritable(id) {
  lastFocusTabId.set(id)
}

import { writable } from "svelte/store"

// Tab info
export let tabIdxToInfo = $state({})

export function resetTabIdxToInfo(data) {
  const previous = Object.keys(tabIdxToInfo)
  const dataEntries = Object.entries(data)

  // set data
  Object.assign(tabIdxToInfo, data)

  for (let i = previous.length; i < data.length; i++) {
    delete tabIdxToInfo[i]
  }
}

export function getTabInfoById(tabId) {
  let filtered = Object.values(tabIdxToInfo).filter(
    ({ id }) => id === Number(tabId),
  )
  return filtered.length === 0 ? null : filtered[0]
}

// Content script unavailable tabs
let contentScriptUnavailableTabs = $derived(
  Object.values(tabIdxToInfo)
    .filter(({ contentScriptAvailable }) => !contentScriptAvailable)
    .map(({ id, title, url, index }) => ({ id, title, url, index })),
)

export function getContentScriptUnavailableTabs() {
  return contentScriptUnavailableTabs
}

if (import.meta.env.MODE === "development") {
  $effect.root(() => {
    $effect(() => {
      console.log(
        "[tabInfo] [effect] [tabIdxToInfo length] [contentScriptUnavailableTabs]",
        Object.values(tabIdxToInfo).length,
        contentScriptUnavailableTabs,
      )
    })
  })
}

// Last focus tab id
let lastFocusTabId = $state(-1)

export function getLastFocusTabId() {
  return lastFocusTabId
}

export function setLastFocusTabId(id) {
  lastFocusTabId = id
}

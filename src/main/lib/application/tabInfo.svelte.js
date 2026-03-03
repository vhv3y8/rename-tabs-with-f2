import { writable } from "svelte/store"

// Tab info
export let tabIdxToInfo = $state({})

export function resetTabIdxToInfo(data) {
  const previous = Object.keys(tabIdxToInfo)
  const dataEntries = Object.entries(data)

  // set data
  // for (const [idx, info] of dataEntries) {
  //   tabIdxToInfo[idx] = info
  // }
  Object.assign(tabIdxToInfo, data)

  for (let i = previous.length; i < data.length; i++) {
    delete tabIdxToInfo[i]
  }
  // previous.forEach((k) => delete tabIdxToInfo[k])
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
        "[contentScriptUnavailableTabs update]",
        Object.values(tabIdxToInfo).length,
        contentScriptUnavailableTabs,
      )
    })
  })
}

// export function getRefreshAndBrowserUnavailableTabs() {
//   const browserUnavailableTabs = []
//   const refreshUnavailableTabs = []

//   for (const info of contentScriptUnavailableTabs) {
//     if (filterUrlsBlockedByBrowser(info.url)) {
//       browserUnavailableTabs.push(info)
//     } else {
//       refreshUnavailableTabs.push(info)
//     }
//   }

//   if (import.meta.env.MODE === "development") {
//     console.log("{ browserUnavailableTabs, refreshUnavailableTabs }", {
//       browserUnavailableTabs,
//       refreshUnavailableTabs,
//     })
//   }

//   return {
//     browserUnavailableTabs,
//     refreshUnavailableTabs,
//   }
// }

// const browserBlockedRegexes = [
//   /chrome:\/\/.*/i,
//   /chrome-extension:\/\/.*/i,
//   /https:\/\/chrome.google.com\/webstore\/.*/i,
//   /https:\/\/chromewebstore.google.com\/.*/i,
// ]

// export function filterUrlsBlockedByBrowser(url) {
//   return browserBlockedRegexes.some((filter) => filter.test(url))
// }

// Reloading statuses
// let allTabStatus = $derived(
//   Object.values(tabIdxToInfo).map(({ id, status }) => ({ id, status })),
// )
// let everyTabStatusIsComplete = $derived(
//   allTabStatus.every((status) => status === "complete"),
// )

// chrome.tabs.onUpdated.addListener((id, { status }, { index }) => {
//   console.log("[tabs.onUpdated]", { id, status })
//   tabIdxToInfo[index]["status"] = status
// })

// export function getAllTabStatus() {
//   return allTabStatus
// }
// export function getEveryTabStatusIsComplete() {
//   return everyTabStatusIsComplete
// }

// Last focus tab id
// reassignment is not available with runes state
// let lastFocusTabId = writable(-1)
let lastFocusTabId = $state(-1)

export function getLastFocusTabId() {
  return lastFocusTabId
}

export function setLastFocusTabId(id) {
  lastFocusTabId = id
}

//
// export function getLastFocusTabIdWritable() {
//   let val
//   lastFocusTabId.subscribe((v) => (val = v))()
//   return val
// }

// export function setLastFocusTabIdWritable(id) {
//   lastFocusTabId.set(id)
// }

import * as chromeStorage from "./lib/chrome/storage"
import * as chromeTabs from "./lib/chrome/tabs"
import * as chromeWindows from "./lib/chrome/windows"

let winIdLastFocusTabIdMap = new Map()
let extensionTabIdSet = new Set()

async function setIdCollectionsAndOpenPage() {
  const currentWindowId = await chromeWindows.getCurrentWindowId({
    fromServiceWorker: true,
  })
  // get last focus tab
  await chromeTabs.getCurrentWindowActiveTab().then((tabs) => {
    // set window id to last focus tab id map
    const lastFocusTabId = tabs[0].id
    winIdLastFocusTabIdMap.set(currentWindowId, lastFocusTabId)
  })

  // open extension main page
  await chromeTabs.openMainPage().then((tab) => {
    // set extension tab id set
    extensionTabIdSet.add(tab.id)
  })

  if (import.meta.env.MODE === "development") {
    console.log("[extensionTabIdSet.entries()]", extensionTabIdSet.entries())
    console.log(
      "[winIdLastFocusTabIdMap.entries()]",
      winIdLastFocusTabIdMap.entries(),
    )
  }
}

// Icon click open
chrome.action.onClicked.addListener(setIdCollectionsAndOpenPage)

// Message
chrome.runtime.onMessage.addListener(async (msg, sender, sendRes) => {
  switch (msg.cmd) {
    // shortcut open
    case "OPEN": {
      setIdCollectionsAndOpenPage()
      break
    }
    // for ui initial tab
    case "LAST_FOCUS_TAB_ID": {
      sendRes(winIdLastFocusTabIdMap.get(sender.tab.windowId))
      break
    }
  }
})

if (import.meta.env.MODE === "development") {
  chrome.tabs.onCreated.addListener(() => {
    chrome.runtime.sendMessage("hihihihihihi")
  })
}

// Handle extension page close
chrome.tabs.onRemoved.addListener(async (tabId, { windowId }) => {
  if (extensionTabIdSet.has(tabId) && winIdLastFocusTabIdMap.has(windowId)) {
    // focus last focus tab of the window
    const lastFocusTabId = winIdLastFocusTabIdMap.get(windowId)
    await chromeTabs.focusTab(lastFocusTabId)

    // remove tab id and window id from collections
    extensionTabIdSet.delete(tabId)
    winIdLastFocusTabIdMap.delete(windowId)

    if (import.meta.env.MODE === "development") {
      console.log("[extensionTabIdSet.entries()]", extensionTabIdSet.entries())
      console.log(
        "[winIdLastFocusTabIdMap.entries()]",
        winIdLastFocusTabIdMap.entries(),
      )
    }
  }
})

// Storage
chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === "install") {
    console.log("[installed]")
    chromeStorage.initializeStorage(chromeStorage.initialStorage)
  } else if (reason === "update") {
    console.log("[updated]")
    chromeStorage.migrateStorage(chromeStorage.initialStorage)
  }
})

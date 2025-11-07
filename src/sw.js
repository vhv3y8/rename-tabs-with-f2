import * as chromeStorage from "./lib/chrome/storage"
import * as chromeTabs from "./lib/chrome/tabs"

let lastFocusTabId

async function setInitialTabIdAndOpenPage() {
  // get and set last focus tab id
  await chromeTabs.getCurrentWindowActiveTab().then((tabs) => {
    lastFocusTabId = tabs[0].id
  })
  // open extension main page
  await chromeTabs.openMainPage()
}

// Icon Click
chrome.action.onClicked.addListener(setInitialTabIdAndOpenPage)

// Message
chrome.runtime.onMessage.addListener(async (msg, sender, sendRes) => {
  switch (msg) {
    case "OPEN": {
      setInitialTabIdAndOpenPage()
      break
    }
    // from extension main page, for ui
    case "LAST_FOCUS_TABID": {
      sendRes(lastFocusTabId)
      break
    }
    // focus last active tab
    case "FOCUS_BACK": {
      chromeTabs.focusTab(lastFocusTabId).then(sendRes)
      break
    }
  }
})

// Storage
chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === "install") {
    chromeStorage.initializeStorage(chromeStorage.initialStorage)
  } else if (reason === "update") {
    chromeStorage.migrateStorage(chromeStorage.initialStorage)
  }
})

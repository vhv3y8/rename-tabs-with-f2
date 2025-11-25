import * as chromeWindows from "./windows"

export function getExtensionPageURL() {
  return chrome.runtime.getURL("main/index.html")
}

/**
 * Extension Page
 */

// Message
// Check service worker file for the handlers

export async function getLastFocusTabId() {
  // const currentWindowId = await chromeWindows.getCurrentWindowId({
  //   fromServiceWorker: false,
  // })
  return chrome.runtime.sendMessage({
    cmd: "LAST_FOCUS_TAB_ID",
  })
}

/**
 * Content Script
 */

export async function fireOpenExtensionPage() {
  return chrome.runtime.sendMessage({ cmd: "OPEN" })
}

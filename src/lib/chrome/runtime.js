export function getExtensionPageURL() {
  return chrome.runtime.getURL("main/index.html")
}

// Message
// Check service worker file for the handlers

export async function getLastFocusTabId() {
  return chrome.runtime.sendMessage("LAST_FOCUS_TABID")
}

export async function fireFocusLastActiveTab() {
  return chrome.runtime.sendMessage("FOCUS_BACK")
}

export async function fireOpenExtensionPage() {
  return chrome.runtime.sendMessage("OPEN")
}

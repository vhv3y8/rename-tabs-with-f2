import * as chromeRuntime from "./runtime"

// Create

export async function openMainPage() {
  // close existing extension pages on current window
  await getCurrentWindowExtensionPageIds().then((tabIds) =>
    chrome.tabs.remove(tabIds),
  )
  return chrome.tabs.create({
    url: chromeRuntime.getExtensionPageURL(),
  })
}

// Update

export async function focusTab(tabId) {
  return chrome.tabs.update(tabId, { active: true })
}

// instead of checking if its page close or refresh at pagehide handler alongside focusing last focus tab,
// just focus extension page every time when page is created.
export async function focusExtensionPageTabForRefresh() {
  return chrome.tabs
    .query({ url: chromeRuntime.getExtensionPageURL() })
    .then((tabs) => chrome.tabs.update(tabs[0].id, { active: true }))
}

// Query

async function getCurrentWindowExtensionPageIds() {
  return chrome.tabs
    .query({
      currentWindow: true,
      url: chromeRuntime.getExtensionPageURL(),
    })
    .then((tabs) => tabs.map(({ id }) => id))
}

export async function getCurrentWindowActiveTab() {
  return chrome.tabs.query({ currentWindow: true, active: true })
}

export async function getAllCurrentWindowTabsWithoutExtensionPage() {
  const allCurrentWindowTabs = await chrome.tabs.query({ currentWindow: true })
  const currentWindowExtensionTabIds = await getCurrentWindowExtensionPageIds()

  return allCurrentWindowTabs.filter(
    ({ id }) => !currentWindowExtensionTabIds.includes(id),
  )
}

// Message
// check content script file for handlers

export async function fireChangeTitleToContentScript({ id, title }) {
  return chrome.tabs.sendMessage(id, {
    title,
  })
}

export async function contentScriptIsAvailable({ id }) {
  return chrome.tabs.sendMessage(id, "SEND_TRUE_CONTENT_SCRIPT")
}

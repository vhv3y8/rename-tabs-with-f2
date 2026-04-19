import ChromeRuntime from "./runtime"

const ChromeTabs = {
  query: {
    async getCurrentWindowExtensionPageIds(): Promise<number[]> {
      return chrome.tabs
        .query({
          currentWindow: true,
          url: ChromeRuntime.getExtensionPageURL(),
        })
        .then((tabs) => tabs.map(({ id }) => id!))
    },
    async getCurrentWindowActiveTab(): Promise<chrome.tabs.Tab[]> {
      return chrome.tabs.query({ currentWindow: true, active: true })
    },
    async getAllCurrentWindowTabsWithoutExtensionPage(): Promise<
      chrome.tabs.Tab[]
    > {
      const allCurrentWindowTabs = await chrome.tabs.query({
        currentWindow: true,
      })
      const currentWindowExtensionTabIds =
        await ChromeTabs.query.getCurrentWindowExtensionPageIds()

      if (import.meta.env.MODE === "development")
        console.log("[allCurrentWindowTabs]", allCurrentWindowTabs)

      return allCurrentWindowTabs.filter(
        ({ id }) => !currentWindowExtensionTabIds.includes(id!),
      )
    },
  },
  create: {
    async openMainPage(): Promise<chrome.tabs.Tab> {
      // close all existing extension pages on current window
      await ChromeTabs.query
        .getCurrentWindowExtensionPageIds()
        .then((tabIds) => chrome.tabs.remove(tabIds))
      return chrome.tabs.create({
        url: ChromeRuntime.getExtensionPageURL(),
      })
    },
  },
  operate: {
    async reloadTab(tabId: number): Promise<void> {
      return chrome.tabs.reload(tabId)
    },
    // TODO: fix handling refresh
    // async focusTab(tabId: number): Promise<void> {
    //   await chrome.tabs.update(tabId, { active: true })
    // },
  },
  message: {
    async fireChangeTitleToContentScript({
      id,
      title,
    }: {
      id: number
      title: any
    }): Promise<unknown> {
      return chrome.tabs.sendMessage(id, {
        title,
      })
    },
    async isContentScriptConnected({ id }: { id: number }): Promise<unknown> {
      return chrome.tabs.sendMessage(id, "SEND_TRUE_CONTENT_SCRIPT")
    },
  },
}

// instead of checking if its page close or refresh at pagehide handler alongside focusing last focus tab,
// just focus extension page every time when page is created.
// export async function focusExtensionPageTabForRefresh() {
//   if (import.meta.env.MODE === "development")
//     console.log("[focusExtensionPageTabForRefresh]")
//   return chrome.tabs
//     .query({ currentWindow: true, url: chromeRuntime.getExtensionPageURL() })
//     .then((tabs) => chrome.tabs.update(tabs[0].id, { active: true }))
// }

export default ChromeTabs

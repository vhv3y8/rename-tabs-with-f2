import type { TitleApplyingInfosReord } from "@sw/application/ports/infra/PlatformSWFacade"

const ChromeRuntime = {
  getExtensionPageURL() {
    return chrome.runtime.getURL("main/index.html")
  },
  async getLastFocusTabId(): Promise<number | null> {
    try {
      const lastFocusTabId = await chrome.runtime.sendMessage({
        cmd: "LAST_FOCUS_TAB_ID",
      })
      return lastFocusTabId
    } catch {
      return null
    }
  },
  async fetchExistingOriginalTitles(
    tabIds: number[],
  ): Promise<TitleApplyingInfosReord> {
    try {
      const existingOriginalTitles = await chrome.runtime.sendMessage({
        cmd: "EXISTING_TITLE_APPLYING_INFOS",
        tabIds,
      })
      return existingOriginalTitles
    } catch {
      // connection error. return empty array
      return []
    }
  },
  async fireOpenExtensionPage(): Promise<void> {
    try {
      await chrome.runtime.sendMessage({ cmd: "OPEN" })
    } catch {}
  },
}

export default ChromeRuntime

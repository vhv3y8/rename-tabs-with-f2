const ChromeRuntime = {
  getExtensionPageURL() {
    return chrome.runtime.getURL("main/index.html")
  },
  getLastFocusTabId() {
    // const currentWindowId = await chromeWindows.getCurrentWindowId({
    //   fromServiceWorker: false,
    // })
    return chrome.runtime.sendMessage({
      cmd: "LAST_FOCUS_TAB_ID",
    })
  },
  fetchExistingTitleApplyingInfos(tabIds: number[]) {
    return chrome.runtime.sendMessage({
      cmd: "EXISTING_TITLE_APPLYING_INFOS",
      tabIds,
    })
  },
  fireOpenExtensionPage() {
    return chrome.runtime.sendMessage({ cmd: "OPEN" })
  },
}

export default ChromeRuntime

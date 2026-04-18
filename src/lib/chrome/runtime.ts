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
  fireOpenExtensionPage() {
    return chrome.runtime.sendMessage({ cmd: "OPEN" })
  },
}

export default ChromeRuntime

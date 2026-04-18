import * as chromeRuntime from "./lib/chrome/runtime"
import * as chromeStorage from "./lib/chrome/storage2"

let shortcut

window.addEventListener("load", async (e) => {
  shortcut = await chromeStorage.getSettings().then(({ shortcut }) => shortcut)
})

// open extension page on hotkey press
window.addEventListener("keydown", (e) => {
  if (
    e.ctrlKey === shortcut.ctrlKey &&
    e.shiftKey === shortcut.shiftKey &&
    e.metaKey === shortcut.metaKey &&
    e.key === shortcut.key
  ) {
    chromeRuntime.fireOpenExtensionPage()
  }
})

chrome.runtime.onMessage.addListener((msg, sender, sendRes) => {
  if (import.meta.env.MODE === "development") {
    console.log(
      "[message from rename tabs with f2]",
      sender.id,
      sender.id === chrome.runtime.id,
      msg,
    )
  }

  if (sender.id === chrome.runtime.id) {
    if (msg === "SEND_TRUE_CONTENT_SCRIPT") {
      // to check if content script is available on each tab
      sendRes(true)
    } else if (typeof msg === "object" && "title" in msg) {
      // set current tab title to text given by extension
      document.title = msg.title
    }
  }
})

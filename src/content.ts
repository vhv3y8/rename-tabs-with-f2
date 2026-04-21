import ChromeStorage from "./lib/chrome/storage"
import ChromeRuntime from "./lib/chrome/runtime"
import type { HotKey } from "./lib/models/Setting"

let hotkey: HotKey

window.addEventListener("load", async (e) => {
  hotkey = await ChromeStorage.setting
    .getSettings()
    .then(({ hotkey }) => hotkey)
})

// open extension page on hotkey press
window.addEventListener("keydown", (e) => {
  console.log("[hotkey]", hotkey)
  if (
    e.ctrlKey === hotkey.ctrlKey &&
    e.shiftKey === hotkey.shiftKey &&
    e.metaKey === hotkey.metaKey &&
    e.key === hotkey.key
  ) {
    ChromeRuntime.fireOpenExtensionPage()
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
      // const rand = Math.random()
      // if (rand < 1 / 3) {
      //   console.log("[rand] [1]")
      //   sendRes(true)
      // } else if (rand < 2 / 3) {
      //   console.log("[rand] [2]")
      //   sendRes(false)
      // } else {
      //   console.log("[rand] [3]")
      // }
      sendRes(true)
    } else if (typeof msg === "object" && "title" in msg) {
      // set current tab title to text given by extension
      document.title = msg.title
    }
  }
})

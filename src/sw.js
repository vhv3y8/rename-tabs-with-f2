let activeTabId
let createdExtensionTabId

chrome.runtime.onMessage.addListener(async (msg, sender, sendRes) => {
  switch (msg) {
    case "RENAME": {
      sendRes(chrome.runtime.id)
      Promise.all([
        // get active tab
        chrome.tabs
          .query({ currentWindow: true, active: true })
          .then((tabs) => {
            activeTabId = tabs[0].id
          }),
        // open extension main page
        chrome.tabs
          .create({
            url: chrome.runtime.getURL("main/index.html"),
          })
          .then((tab) => {
            createdExtensionTabId = tab.id
          }),
      ])
      break
    }

    case "TABID": {
      sendRes(activeTabId)
      break
    }
  }
})

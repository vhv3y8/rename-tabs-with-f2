let f2PressedTabId
let createdExtensionTabId

chrome.runtime.onMessage.addListener((msg, sender, sendRes) => {
  switch (msg) {
    case "RENAME": {
      // get active tab
      chrome.tabs.query({ currentWindow: true, active: true }).then((tabs) => {
        f2PressedTabId = tabs[0].id

        // open extension main page
        chrome.tabs
          .create({
            url: chrome.runtime.getURL("main/index.html"),
          })
          .then((tab) => {
            createdExtensionTabId = tab.id
          })
      })
      break
    }

    case "TABID": {
      sendRes(f2PressedTabId)
      break
    }
  }
})

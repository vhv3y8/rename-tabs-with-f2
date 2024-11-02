window.addEventListener("keydown", (e) => {
  if (e.key === "F2") {
    console.log("F2 is pressed. (rename-tabs-with-f2)")
    chrome.runtime.sendMessage("RENAME")
  }
})

chrome.runtime.onMessage.addListener((msg, sender, sendRes) => {
  if (
    sender.id === chrome.runtime.id &&
    typeof msg === "object" &&
    "title" in msg
  ) {
    document.title = msg.title
  }
})

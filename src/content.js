window.addEventListener("keydown", (e) => {
  if (e.key === "F2") {
    console.log("F2 is pressed. (rename-tabs-with-f2)")
    chrome.runtime.sendMessage("RENAME")
  }
})

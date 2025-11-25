chrome.runtime.onMessage.addListener((msg) => {
  console.log("[BRIDGE]", msg)
})

window.addEventListener("SEND_RUNTIME", (e) => {
  chrome.runtime.sendMessage({ cmd: e.detail.cmd })
})

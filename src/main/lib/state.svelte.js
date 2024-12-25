let activeTabId = await chrome.runtime.sendMessage("TABID")

let tabIdToInfo = $state(
  await chrome.tabs.query({ currentWindow: true, active: false }).then((tabs) =>
    tabs.reduce((acc, { id, title, favIconUrl, index }) => {
      acc[index] = { id, title, favIconUrl, hasChanged: false }
      return acc
    }, {}),
  ),
)

console.log("tabIdToInfo", tabIdToInfo)

export { activeTabId, tabIdToInfo }

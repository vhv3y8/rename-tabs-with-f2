export function sendTitleChangeMessages(tabIdToInfo) {
  return Promise.all(
    Object.values(tabIdToInfo)
      .filter((tabInfo) => tabInfo.hasChanged)
      .map((tabInfo) => {
        // send changed title to each content script
        chrome.tabs.sendMessage(tabInfo.id, {
          title: tabInfo.title,
        })
      }),
  )
}

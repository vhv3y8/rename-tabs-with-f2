import type { OpenMainPageUseCase } from "../../application/usecases/openMainPage"
import type { SendLastFocusTabIdUseCase } from "../../application/usecases/send/sendLastFocusTabId"

export function createMessageHandler(
  openMainPageUseCase: OpenMainPageUseCase,
  sendLastFocusTabIdUseCase: SendLastFocusTabIdUseCase,
): Parameters<typeof chrome.runtime.onMessage.addListener>[0] {
  return async function messageHandler(msg, sender, sendRes) {
    switch (msg.cmd) {
      // shortcut open
      case "OPEN": {
        openMainPageUseCase()
        break
      }
      // for ui initial tab
      case "LAST_FOCUS_TAB_ID": {
        // sendRes(winIdLastFocusTabIdMap.get(sender.tab?.windowId))
        if (sender.tab) {
          sendLastFocusTabIdUseCase(sender.tab.windowId, (lastFocusTabId) => {
            sendRes(lastFocusTabId)
          })
        }
        break
      }
    }
  }
}

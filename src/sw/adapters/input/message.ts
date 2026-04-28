import type { SendOriginalTitlesUseCase } from "@sw/application/usecases/send/sendOriginalTitles"
import type { OpenMainPageUseCase } from "../../application/usecases/openMainPage"
import type { SendLastFocusTabIdUseCase } from "../../application/usecases/send/sendLastFocusTabId"

export function createMessageHandler(
  bootstrapPromise: Promise<{
    openMainPageUseCase: OpenMainPageUseCase
    sendLastFocusTabIdUseCase: SendLastFocusTabIdUseCase
    sendOriginalTitlesUseCase: SendOriginalTitlesUseCase
  }>,
): Parameters<typeof chrome.runtime.onMessage.addListener>[0] {
  // always have to be synchronous function?
  return function messageHandler(msg, sender, sendRes) {
    bootstrapPromise.then(
      ({
        openMainPageUseCase,
        sendLastFocusTabIdUseCase,
        sendOriginalTitlesUseCase,
      }) => {
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
              sendLastFocusTabIdUseCase(sender.tab.windowId, sendRes)
            }
            break
          }
          case "EXISTING_TITLE_APPLYING_INFOS": {
            sendOriginalTitlesUseCase(msg.tabIds || [], sendRes)
            break
          }
        }
      },
    )
    // needed to tell chrome that handler will return later asynchronously
    return true
  }
}

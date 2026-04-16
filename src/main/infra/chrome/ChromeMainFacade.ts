import { getLastFocusTabId } from "@chrome/runtime"
import {
  isContentScriptConnected,
  fireChangeTitleToContentScript,
  getAllCurrentWindowTabsWithoutExtensionPage,
  reloadTab,
} from "@chrome/tabs"

export interface ChromeMainFacade {
  // tabs
  fireChangeTitleToContentScript: typeof fireChangeTitleToContentScript
  isContentScriptConnected: typeof isContentScriptConnected
  getAllCurrentWindowTabsWithoutExtensionPage: typeof getAllCurrentWindowTabsWithoutExtensionPage
  reloadTab: typeof reloadTab
  // runtime
  getLastFocusTabId: typeof getLastFocusTabId
}

export const ChromeMainFacadeImpl: ChromeMainFacade = {
  // tabs
  fireChangeTitleToContentScript,
  isContentScriptConnected,
  getAllCurrentWindowTabsWithoutExtensionPage,
  reloadTab,
  // runtime
  getLastFocusTabId,
}

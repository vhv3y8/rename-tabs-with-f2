import { getLastFocusTabId } from "@chrome/runtime"
import { defaultShortcutF2, getSettings, setSettings } from "@chrome/storage"
import {
  isContentScriptConnected,
  fireChangeTitleToContentScript,
  getAllCurrentWindowTabsWithoutExtensionPage,
  reloadTab,
  focusExtensionPageTabForRefresh,
} from "@chrome/tabs"

export interface ChromeMainFacade {
  // tabs
  renameTabTitle: typeof fireChangeTitleToContentScript
  checkContentScriptConnection: typeof isContentScriptConnected
  getTabEntries: typeof getAllCurrentWindowTabsWithoutExtensionPage
  reloadTab: typeof reloadTab
  focusExtensionPageTabForRefresh: typeof focusExtensionPageTabForRefresh
  // runtime
  getLastFocusTabId: typeof getLastFocusTabId
  // storage
  getSettings: typeof getSettings
  setSettings: typeof setSettings
  defaultShortcutF2: typeof defaultShortcutF2
}

export const ChromeMainFacadeImpl: ChromeMainFacade = {
  renameTabTitle: fireChangeTitleToContentScript,
  checkContentScriptConnection: isContentScriptConnected,
  getTabEntries: getAllCurrentWindowTabsWithoutExtensionPage,
  reloadTab,
  focusExtensionPageTabForRefresh,
  getLastFocusTabId,
  getSettings,
  setSettings,
  defaultShortcutF2,
}

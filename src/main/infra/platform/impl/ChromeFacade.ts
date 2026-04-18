import { getLastFocusTabId } from "@lib/chrome/runtime"
import {
  defaultShortcutF2,
  getSettings,
  setSettings,
} from "@lib/chrome/storage"
import {
  fireChangeTitleToContentScript,
  getAllCurrentWindowTabsWithoutExtensionPage,
  isContentScriptConnected,
  reloadTab,
} from "@lib/chrome/tabs"
import type { PlatformMainFacade } from "@main/application/ports/PlatformMainFacade"

// TODO
export const ChromeFacade: PlatformMainFacade = {
  // tabs
  getInitializeTabEntries() {
    return getAllCurrentWindowTabsWithoutExtensionPage()
  },
  checkTabConnection({ tabId }) {
    return isContentScriptConnected({ id: tabId })
  },
  reloadTab({ tabId }) {
    return reloadTab(tabId)
  },
  renameTabTitle({ tabId, title }) {
    return fireChangeTitleToContentScript({ id: tabId, title })
  },
  // focusExtensionPageTabForRefresh(): Promise<unknown>
  // runtime
  getLastFocusTabId() {
    return getLastFocusTabId()
  },
  // storage
  getSettings() {
    return getSettings()
  },
  setSettings(setting) {
    return setSettings(setting)
  },
  // defaultShortcutF2: defaultShortcutF2,
}

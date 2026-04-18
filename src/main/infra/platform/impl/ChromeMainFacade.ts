import ChromeRuntime from "@lib/chrome/runtime"
import ChromeStorage from "@lib/chrome/storage"
import ChromeTabs from "@lib/chrome/tabs"
import type { PlatformMainFacade } from "@main/application/ports/PlatformMainFacade"

// TODO
export const ChromeMainFacade: PlatformMainFacade = {
  // tabs
  getInitializeTabEntries() {
    return ChromeTabs.query.getAllCurrentWindowTabsWithoutExtensionPage()
  },
  checkTabConnection({ tabId }) {
    return ChromeTabs.message.isContentScriptConnected({ id: tabId })
  },
  reloadTab({ tabId }) {
    return ChromeTabs.operate.reloadTab(tabId)
  },
  renameTabTitle({ tabId, title }) {
    return ChromeTabs.message.fireChangeTitleToContentScript({
      id: tabId,
      title,
    })
  },
  // focusExtensionPageTabForRefresh(): Promise<unknown>
  // runtime
  getLastFocusTabId() {
    return ChromeRuntime.getLastFocusTabId()
  },
  // storage
  getSettings() {
    return ChromeStorage.setting.getSettings()
  },
  setSettings(setting) {
    return ChromeStorage.setting.setSettings(setting)
  },
  // defaultShortcutF2: defaultShortcutF2,
}

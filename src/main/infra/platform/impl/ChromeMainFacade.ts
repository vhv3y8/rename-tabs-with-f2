import { type Setting } from "@lib/models/Setting"
import ChromeRuntime from "@lib/chrome/runtime"
import ChromeStorage from "@lib/chrome/storage"
import ChromeTabs from "@lib/chrome/tabs"
import type { PlatformMainFacade } from "@main/application/ports/infra/PlatformMainFacade"
import type { URLTitleRecord } from "@main/domain/entities/URLTitleCollection"

class ChromeMainFacade implements PlatformMainFacade {
  // tabs
  getInitializeTabEntries() {
    return ChromeTabs.query.getAllCurrentWindowTabsWithoutExtensionPage()
  }
  checkTabConnection({ tabId }: { tabId: number }) {
    return ChromeTabs.message.isContentScriptConnected({ id: tabId })
  }
  reloadTab({ tabId }: { tabId: number }) {
    return ChromeTabs.operate.reloadTab(tabId)
  }
  renameTabTitle({ tabId, title }: { tabId: number; title: any }) {
    return ChromeTabs.message.fireChangeTitleToContentScript({
      id: tabId,
      title,
    })
  }
  // focusExtensionPageTabForRefresh(): Promise<unknown>
  // runtime
  getLastFocusTabId() {
    return ChromeRuntime.getLastFocusTabId()
  }
  // storage
  getSettings() {
    return ChromeStorage.setting.getSettings()
  }
  setSettings(setting: Setting) {
    return ChromeStorage.setting.setSettings(setting)
  }
  async getTitles(): Promise<URLTitleRecord> {
    return ChromeStorage.titles.getTitles()
  }
  async setTitles(titles: URLTitleRecord): Promise<void> {
    return ChromeStorage.titles.setTitles(titles)
  }

  // chrome specific
  // addTabsOnUpdatedHandlerForReload = chrome.tabs.onUpdated.addListener
  // removeTabsOnUpdatedHandlerForReload = chrome.tabs.onUpdated.removeListener
}
export const ChromeFacade = new ChromeMainFacade()

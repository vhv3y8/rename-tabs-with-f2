import ChromeStorage from "@chrome/storage"
import ChromeTabs from "@chrome/tabs"
import ChromeWindows from "@chrome/windows"
import type { PlatformSWFacade } from "../../application/ports/PlatformSWFacade"

export const ChromeSWFacade: PlatformSWFacade = {
  // storage
  async initializeStorage() {
    return ChromeStorage.initializeStorage()
  },
  async migrateStorage(previousVersion: string, updatedDefaults?: any) {
    return ChromeStorage.migrateStorage(previousVersion, updatedDefaults)
  },
  async getSettings() {
    return ChromeStorage.setting.getSettings()
  },
  async getTitleRecord() {
    return ChromeStorage.titles.getTitles()
  },

  // tabs
  async openMainPage() {
    return ChromeTabs.create.openMainPage()
  },
  async focusTab(tabId: number) {
    return ChromeTabs.operate.focusTab(tabId)
  },
  async getCurrentWindowActiveTab() {
    const activeTabs = await ChromeTabs.query.getCurrentWindowActiveTab()
    return activeTabs[0]
  },
  async applyPersistedTitle(id: number, title: any) {
    return ChromeTabs.message.fireChangeTitleToContentScript({ id, title })
  },

  // windows
  async getCurrentWindowId() {
    const windowId = await ChromeWindows.getCurrentWindowId(false)
    return windowId || null
  },
}

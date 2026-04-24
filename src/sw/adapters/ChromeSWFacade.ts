import ChromeStorage from "@chrome/storage"
import ChromeTabs from "@chrome/tabs"
import ChromeWindows from "@chrome/windows"

export const ChromeSWFacade = {
  // windows
  async getCurrentWindowId() {
    return ChromeWindows.getCurrentWindowId(false)
  },
  // tabs
  async getCurrentWindowActiveTab() {
    return ChromeTabs.query.getCurrentWindowActiveTab()
  },
  async openMainPage() {
    return ChromeTabs.create.openMainPage()
  },
  async focusTab(tabId: number) {
    return ChromeTabs.operate.focusTab(tabId)
  },
  // storage
  async initializeStorage() {
    return ChromeStorage.initializeStorage()
  },
  async migrateStorage(previousVersion: string, updatedDefaults?: any) {
    return ChromeStorage.migrateStorage(previousVersion, updatedDefaults)
  },
}

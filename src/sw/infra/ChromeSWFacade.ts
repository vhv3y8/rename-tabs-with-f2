import ChromeStorage from "@chrome/storage"
import ChromeTabs from "@chrome/tabs"
import ChromeWindows from "@chrome/windows"
import {
  type PlatformSWFacade,
  type IdCollectionRecord,
  type TitleApplyingInfosReord,
} from "@sw/application/ports/infra/PlatformSWFacade"

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

  // service-worker-only session storage
  async getSessionIdCollections() {
    return chrome.storage.session
      .get(["idCollection"])
      .then((db) => db.idCollection)
  },
  async setSessionIdCollections(idCollectionRecord: IdCollectionRecord) {
    return chrome.storage.session.set({ idCollection: idCollectionRecord })
  },
  async getSessionTitleApplyingInfos() {
    return chrome.storage.session
      .get(["titleApplyingInfos"])
      .then((db) => db.titleApplyingInfos)
  },
  async setSessionTitleApplyingInfos(
    titleApplyingInfosRecord: TitleApplyingInfosReord,
  ) {
    return chrome.storage.session.set({
      titleApplyingInfos: titleApplyingInfosRecord,
    })
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

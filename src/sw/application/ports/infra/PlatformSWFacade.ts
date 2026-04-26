import type { Setting } from "@lib/models/Setting"
import type { TitleRecord } from "@lib/models/TitleRecord"

export interface IdCollectionRecord {
  extensionTabIdCollection: number[]
  windowIdLastFocusTabIdCollection: [number, number][]
}

export type TitleApplyingInfosReord = {
  id: number
  originalTitle: string
  // url: string
}[]

// depend on chrome for now
export interface PlatformSWFacade {
  // storage
  initializeStorage(): Promise<void>
  migrateStorage(previousVersion: string, updatedDefaults?: any): Promise<void>

  getSettings(): Promise<Setting>
  getTitleRecord(): Promise<TitleRecord>

  getSessionIdCollections(): Promise<IdCollectionRecord>
  setSessionIdCollections(record: IdCollectionRecord): Promise<void>
  getSessionTitleApplyingInfos(): Promise<TitleApplyingInfosReord>
  setSessionTitleApplyingInfos(record: TitleApplyingInfosReord): Promise<void>

  // tabs
  openMainPage(): Promise<chrome.tabs.Tab>
  applyPersistedTitle(id: number, title: any): Promise<unknown>
  focusTab(tabId: number): Promise<void>
  getCurrentWindowActiveTab(): Promise<chrome.tabs.Tab>

  // windows
  // TODO
  getCurrentWindowId(): Promise<number | null>
}

import type { Setting } from "@lib/models/Setting"
import type { TitleRecord } from "@lib/models/TitleRecord"

export type IdCollectionRecord = {
  extensionTabIdCollection: number[]
  windowIdLastFocusTabIdCollection: Record<number, number>
}

export type TitleApplyingInfosReord = {
  [tabId: string]: {
    id: number
    // url: string
    originalTitle: string
  }
}

// depend on chrome for now
export interface PlatformSWFacade {
  // storage
  initializeStorage(): Promise<void>
  migrateStorage(previousVersion: string, updatedDefaults?: any): Promise<void>
  getSettings(): Promise<Setting>
  getTitleRecord(): Promise<TitleRecord>
  getIdCollections(): Promise<IdCollectionRecord>
  setIdCollections(record: IdCollectionRecord): Promise<void>
  getTitleApplyingInfos(): Promise<TitleApplyingInfosReord>
  setTitleApplyingInfos(record: TitleApplyingInfosReord): Promise<void>

  // tabs
  openMainPage(): Promise<chrome.tabs.Tab>
  focusTab(tabId: number): Promise<void>
  getCurrentWindowActiveTab(): Promise<chrome.tabs.Tab>
  applyPersistedTitle(id: number, title: any): Promise<unknown>

  // windows
  // TODO
  getCurrentWindowId(): Promise<number | null>
}

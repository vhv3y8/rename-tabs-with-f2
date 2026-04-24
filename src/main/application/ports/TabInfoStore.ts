import { type TabInfo } from "../../domain/entities/TabInfo"

export interface TabInfoStore {
  clearAndSetTabInfos(tabInfos: any): void
  getAllTabInfos(): TabInfo[]
  getById(tabId: number): TabInfo | null
  setConnectedFlag(tabId: number, connected: boolean): void

  getTabInfosToApply(): TabInfo[]
  getTitleInfosToSave(): TabInfo[]
  getTabIdsToReload(): number[]
}

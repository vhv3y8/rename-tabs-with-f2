import type { Setting } from "@lib/models/Setting"
import type { TitleRecord } from "@lib/models/TitleRecord"

// depend on chrome for now
export interface PlatformSWFacade {
  // storage
  initializeStorage(): Promise<void>
  migrateStorage(previousVersion: string, updatedDefaults?: any): Promise<void>
  getSettings(): Promise<Setting>
  getTitleRecord(): Promise<TitleRecord>

  // tabs
  openMainPage(): Promise<chrome.tabs.Tab>
  focusTab(tabId: number): Promise<void>
  getCurrentWindowActiveTab(): Promise<chrome.tabs.Tab>
  applyPersistedTitle(id: number, title: any): Promise<unknown>

  // windows
  // TODO
  getCurrentWindowId(): Promise<number | null>
}

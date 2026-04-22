import type { Setting } from "@lib/models/Setting"
import type { TitleRecord } from "@lib/models/TitleRecord"

// depend on chrome for now
export interface PlatformMainFacade {
  // tabs
  getInitializeTabEntries(): Promise<chrome.tabs.Tab[]>
  checkTabConnection(options: {
    tabId: number
  }): Promise<boolean | undefined | unknown>
  reloadTab(options: { tabId: number }): Promise<void>
  renameTabTitle(options: { tabId: number; title: any }): Promise<unknown>
  // TODO: fix refresh
  // focusExtensionPageTabForRefresh(): Promise<unknown>

  // runtime
  getLastFocusTabId(): Promise<number>

  // storage
  getSettings(): Promise<Setting>
  setSettings(setting: Setting): Promise<void>

  getTitleRecord(): Promise<TitleRecord>
  setTitleRecord(record: TitleRecord): Promise<void>
}

import type { Setting } from "@lib/models/Setting"
import type { TitleRecord } from "@lib/models/TitleRecord"
import type { TitleApplyingInfosReord } from "@sw/application/ports/infra/PlatformSWFacade"

// depend on chrome for now
export interface PlatformMainFacade {
  // tabs
  getInitializeTabEntries(): Promise<chrome.tabs.Tab[]>
  checkTabConnection(options: { tabId: number }): Promise<boolean>
  reloadTab(options: { tabId: number }): Promise<void>
  renameTabTitle(options: { tabId: number; title: any }): Promise<void>
  // TODO: fix refresh
  // focusExtensionPageTabForRefresh(): Promise<unknown>

  // runtime
  getLastFocusTabId(): Promise<number | null>
  fetchExistingOriginalTitles(
    tabIds: number[],
  ): Promise<TitleApplyingInfosReord>

  // storage
  getSettings(): Promise<Setting>
  setSettings(setting: Setting): Promise<void>

  getTitleRecord(): Promise<TitleRecord>
  setTitleRecord(record: TitleRecord): Promise<void>
}

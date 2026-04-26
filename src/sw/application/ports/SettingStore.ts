export interface SettingStore {
  fetchSetting(): Promise<void>

  shouldApplyTitles(): Promise<boolean>
}

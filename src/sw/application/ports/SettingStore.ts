export interface SettingStore {
  saveStore(): Promise<void>

  shouldApplyTitles(): boolean
}

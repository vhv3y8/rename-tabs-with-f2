export interface SettingStore {
  update(): Promise<void>
  shouldApplyTitles(): Promise<boolean>
}

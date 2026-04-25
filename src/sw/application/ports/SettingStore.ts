export interface SettingStore {
  update(): Promise<void>
  shouldApplyTitles(): boolean
}

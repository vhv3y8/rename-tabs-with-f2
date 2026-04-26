import type { SettingStore } from "@sw/application/ports/SettingStore"

export type UpdateInMemorySettingUseCase = ReturnType<
  typeof createUpdateInMemorySetting
>

export function createUpdateInMemorySetting(settingStore: SettingStore) {
  return async function updateInMemorySetting() {
    await settingStore.fetchSetting()
  }
}

import type { PlatformSWFacade } from "../ports/infra/PlatformSWFacade"
import type { SettingStore } from "../ports/SettingStore"

export type CheckAndApplyTitleUseCase = ReturnType<
  typeof createCheckAndApplyTitle
>

export function createCheckAndApplyTitle(
  extensionFacade: PlatformSWFacade,
  settingStore: SettingStore,
) {
  return async function checkAndApplyTitle() {
    if (await settingStore.shouldApplyTitles()) {
      // save original title
      // apply title
      extensionFacade.applyPersistedTitle()
    }
  }
}

import type { PlatformSWFacade } from "../ports/PlatformSWFacade"
import type { SettingStore } from "../ports/SettingStore"

export function createCheckAndApplyTitle(
  extensionFacade: PlatformSWFacade,
  settingStore: SettingStore,
) {
  return async function checkAndApplyTitle() {
    if (settingStore.shouldApplyTitles()) {
      // save original title
      // apply title
      extensionFacade.applyPersistedTitle()
    }
  }
}

import type { Setting } from "@lib/models/Setting"
import type { PlatformSWFacade } from "@sw/application/ports/infra/PlatformSWFacade"
import type { SettingStore } from "@sw/application/ports/SettingStore"

export class SettingStoreImpl implements SettingStore {
  private constructor(
    private setting: Setting,
    private extensionFacade: PlatformSWFacade,
  ) {}
  // use this to create instance
  static async build(extensionFacade: PlatformSWFacade) {
    const setting = await extensionFacade.getSettings()
    return new SettingStoreImpl(setting, extensionFacade)
  }

  async update() {
    this.setting = await this.extensionFacade.getSettings()
  }
  async shouldApplyTitles() {
    if (this.setting.persistAndApplyTitles) return true
    else return false
  }
}

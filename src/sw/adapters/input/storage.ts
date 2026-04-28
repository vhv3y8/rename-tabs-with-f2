import type { UpdateInMemorySettingUseCase } from "@sw/application/usecases/receive/updateInMemorySetting"
import type { UpdateInMemoryUrlTitleCollectionUseCase } from "@sw/application/usecases/receive/updateInMemoryURLTitle"

export function createStorageChangeHandler(
  bootstrapPromise: Promise<{
    updateInMemorySettingUseCase: UpdateInMemorySettingUseCase
    updateInMemoryUrlTitleCollectionUseCase: UpdateInMemoryUrlTitleCollectionUseCase
  }>,
) {
  return async function storageChangeHandler(
    changes: Record<string, chrome.storage.StorageChange>,
    areaName: chrome.storage.AreaName,
  ) {
    const {
      updateInMemorySettingUseCase,
      updateInMemoryUrlTitleCollectionUseCase,
    } = await bootstrapPromise
    if (areaName === "local") {
      if ("settings" in changes) {
        console.log("[triggering in memory setting update]")
        await updateInMemorySettingUseCase()
      }
      if ("titles" in changes) {
        console.log("[triggering title collection update]")
        await updateInMemoryUrlTitleCollectionUseCase()
      }
    }
  }
}

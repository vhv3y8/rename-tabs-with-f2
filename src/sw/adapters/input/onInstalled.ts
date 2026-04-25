import type { InitializeStorageUseCase } from "../../application/usecases/storage/initializeStorage"
import type { MigrateStorageUseCase } from "../../application/usecases/storage/migrateStorage"

export function createOnInstalledStorageHandler(
  initializeStorageUseCase: InitializeStorageUseCase,
  migrateStorageUseCase: MigrateStorageUseCase,
): Parameters<typeof chrome.runtime.onInstalled.addListener>[0] {
  return async function onInstalledStorageHandler({ reason, previousVersion }) {
    if (reason === "install") {
      console.log("[installed]")
      // extensionSWFacade.initializeStorage().then(() => {
      //   extensionSWFacade.openMainPage()
      // })
      await initializeStorageUseCase()
    } else if (reason === "update") {
      console.log(
        "[updated] [previous version]",
        previousVersion,
        typeof previousVersion,
      )
      // extensionSWFacade.migrateStorage(
      //   // maybe | "1.0.0" ?
      //   previousVersion!,
      // )
      await migrateStorageUseCase(previousVersion!)
    }
  }
}

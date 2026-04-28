import type { PlatformSWFacade } from "../../ports/infra/PlatformSWFacade"

export type MigrateStorageUseCase = ReturnType<typeof createMigrateStorage>

export function createMigrateStorage(extensionFacade: PlatformSWFacade) {
  return async function migrateStorage(previousVersion: string) {
    return extensionFacade.migrateStorage(previousVersion)
  }
}

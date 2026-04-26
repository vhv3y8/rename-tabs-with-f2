import type { OriginalTitleStore } from "@application/ports/OriginalTitleStore"

export type InitializeOriginalTitleStoreUseCase = ReturnType<
  typeof createInitializeOriginalTitleStore
>

export function createInitializeOriginalTitleStore(
  originalTitleStore: OriginalTitleStore,
) {
  return async function initializeOriginalTitleStore() {
    await originalTitleStore.initialize()
  }
}

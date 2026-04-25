import type { IdCollectionStore } from "../../ports/IdCollectionStore"

export type SendLastFocusTabIdUseCase = ReturnType<
  typeof createSendLastFocusTabId
>

export function createSendLastFocusTabId(idCollectionStore: IdCollectionStore) {
  return function sendLastFocusTabId(
    sendFunction: (lastFocusTabId: number) => void,
  ) {
    const lastFocusTabId = idCollectionStore.getLastFocusTabId()
    sendFunction(lastFocusTabId)
  }
}

import type { IdCollectionStore } from "../../ports/IdCollectionStore"

export type SendLastFocusTabIdUseCase = ReturnType<
  typeof createSendLastFocusTabId
>

export function createSendLastFocusTabId(idCollectionStore: IdCollectionStore) {
  return async function sendLastFocusTabId(
    senderWindowId: number,
    sendFunction: (lastFocusTabId: number | null) => void,
  ) {
    if (await idCollectionStore.windowHasLastFocusTab(senderWindowId)) {
      const lastFocusTabId =
        await idCollectionStore.getLastFocusTabId(senderWindowId)
      sendFunction(lastFocusTabId)
    }
  }
}

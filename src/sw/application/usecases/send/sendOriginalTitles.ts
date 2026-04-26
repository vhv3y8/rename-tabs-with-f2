import type { TitleApplyingStore } from "../../ports/TitleApplyingStore"

export type SendOriginalTitlesUseCase = ReturnType<
  typeof createSendOriginalTitles
>

export function createSendOriginalTitles(
  originalTitleStore: TitleApplyingStore,
) {
  return async function sendOriginalTitles(
    tabIds: number[],
    sendFunction: (originalTitles: (string | null)[]) => void,
  ) {
    const originalTitles =
      await originalTitleStore.getAllAppliedTitleOriginals(tabIds)
    sendFunction(originalTitles)
  }
}

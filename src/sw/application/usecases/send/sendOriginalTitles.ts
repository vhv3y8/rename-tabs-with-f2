import type { TitleApplyingStore } from "../../ports/TitleApplyingStore"

export type SendOriginalTitlesUseCase = ReturnType<
  typeof createSendOriginalTitles
>

export function createSendOriginalTitles(
  originalTitleStore: TitleApplyingStore,
) {
  return function sendOriginalTitles(
    tabIds: number[],
    sendFunction: (originalTitles: [number | null][]) => void,
  ) {
    const originalTitles =
      originalTitleStore.getAllAppliedTitleOriginals(tabIds)
    sendFunction(originalTitles)
  }
}

import type { OriginalTitleStore } from "../../ports/OriginalTitleStore"

export type SendOriginalTitlesUseCase = ReturnType<
  typeof createSendOriginalTitles
>

export function createSendOriginalTitles(
  originalTitleStore: OriginalTitleStore,
) {
  return async function sendOriginalTitles(
    tabIds: number[],
    sendFunction: (
      originalTitles: { id: number; originalTitle: string | null }[],
    ) => void,
  ) {
    const originalTitles =
      await originalTitleStore.getAllAppliedTitleOriginals(tabIds)
    if (import.meta.env.MODE === "development")
      console.log("[sw] [sending original titles]", originalTitles)
    sendFunction(originalTitles)
  }
}

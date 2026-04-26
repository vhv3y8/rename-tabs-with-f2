import type { OriginalTitleStore } from "../ports/OriginalTitleStore"
import type { TitleApplyingInfo } from "./checkAndApplyTitle"

export type SaveOriginalTitleBeforeApplyUseCase = ReturnType<
  typeof createSaveOriginalTitleBeforeApply
>

export function createSaveOriginalTitleBeforeApply(
  originalTitleStore: OriginalTitleStore,
) {
  return async function saveOriginalTitleBeforeApply(
    titleApplyingInfo: Pick<TitleApplyingInfo, "id" | "originalTitle">,
  ) {
    const { id, originalTitle } = titleApplyingInfo
    await originalTitleStore.setOriginalTitle(id, originalTitle)
  }
}

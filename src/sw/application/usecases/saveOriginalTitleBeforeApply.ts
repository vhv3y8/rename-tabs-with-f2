import type { TitleApplyingStore } from "../ports/TitleApplyingStore"
import type { TitleApplyingInfo } from "./checkAndApplyTitle"

export type SaveOriginalTitleBeforeApplyUseCase = ReturnType<
  typeof createSaveOriginalTitleBeforeApply
>

export function createSaveOriginalTitleBeforeApply(
  titleApplyingStore: TitleApplyingStore,
) {
  return function saveOriginalTitleBeforeApply(
    titleApplyingInfo: Pick<TitleApplyingInfo, "id" | "originalTitle">,
  ) {
    const { id, originalTitle } = titleApplyingInfo
    titleApplyingStore.setOriginalTitle(id, originalTitle)
  }
}

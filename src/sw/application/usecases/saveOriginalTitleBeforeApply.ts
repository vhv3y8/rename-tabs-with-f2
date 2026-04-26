import type { TitleApplyingStore } from "../ports/TitleApplyingStore"
import type { TitleApplyingInfo } from "./checkAndApplyTitle"

export type SaveOriginalTitleBeforeApplyUseCase = ReturnType<
  typeof createSaveOriginalTitleBeforeApply
>

export function createSaveOriginalTitleBeforeApply(
  titleApplyingStore: TitleApplyingStore,
) {
  return async function saveOriginalTitleBeforeApply(
    titleApplyingInfo: Pick<TitleApplyingInfo, "id" | "originalTitle">,
  ) {
    const { id, originalTitle } = titleApplyingInfo
    await titleApplyingStore.setOriginalTitle(id, originalTitle)
  }
}

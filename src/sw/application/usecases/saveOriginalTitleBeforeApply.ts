import type {
  TitleApplyingInfo,
  TitleApplyingStore,
} from "../ports/TitleApplyingStore"

export type SaveOriginalTitleBeforeApplyUseCase = ReturnType<
  typeof createSaveOriginalTitleBeforeApply
>

export function createSaveOriginalTitleBeforeApply(
  titleApplyingStore: TitleApplyingStore,
) {
  return function saveOriginalTitleBeforeApply(
    titleApplyingInfo: TitleApplyingInfo,
  ) {
    const { id, originalTitle } = titleApplyingInfo
    titleApplyingStore.setOriginalTitle(id, originalTitle)
  }
}

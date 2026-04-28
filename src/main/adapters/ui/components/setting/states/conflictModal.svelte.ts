import type {
  URLTitleConfliction,
  URLTitleConflictItem,
  URLTitleResolvedConfliction,
} from "@domain/entities/URLTitleCollection"
import { settingModal, type SettingModalState } from "./settingModal.svelte"
import { err, ok, type Result } from "@lib/types/Result"
import type { UploadURLTitleConflictError } from "@application/usecases/file/uploadURLTitleCollection"

export interface ConflictState {
  existing: URLTitleConflictItem
  uploaded: URLTitleConflictItem
  urlMatch: string
  isUploadSelected: boolean
}
export class ConflictModalState {
  show = $state(false)
  conflictStates: ConflictState[] = $state([])
  isSelectingAllExisting: boolean
  isSelectingAllUploaded: boolean

  finished = $state(true)
  finishResult: Result<
    URLTitleResolvedConfliction[],
    UploadURLTitleConflictError
  > = err({
    type: "USER_CANCEL",
  })
  constructor(settingModalState: SettingModalState) {
    this.isSelectingAllExisting = $derived(
      this.conflictStates.every(({ isUploadSelected }) => !isUploadSelected),
    )
    this.isSelectingAllUploaded = $derived(
      this.conflictStates.every(({ isUploadSelected }) => isUploadSelected),
    )
    $effect.root(() => {
      $effect(() => {
        // close modal when setting is closed?
        if (settingModalState.show === false) this.cancel()
      })
    })
  }

  open() {
    this.finished = false
    this.show = true
  }
  cancel() {
    this.finishResult = err({
      type: "USER_CANCEL",
    })
    this.finished = true
    this.show = false
  }
  done() {
    const resolvedConflictions = this.conflictStates.map((conflictState) => {
      if (conflictState.isUploadSelected) {
        return conflictState.uploaded
      } else {
        return conflictState.existing
      }
    })
    this.finishResult = ok(resolvedConflictions)
    this.finished = true
    this.show = false
  }

  setConflictionStates(conflictions: URLTitleConfliction[]) {
    this.conflictStates = conflictions.map((confliction) => {
      return {
        existing: confliction[0],
        uploaded: confliction[1],
        isUploadSelected: false,
        urlMatch: confliction[0].match,
      }
    })
    console.log(
      "[conflict state] [uploaded conflict states]",
      this.conflictStates,
    )
  }
  clearConflictions() {
    this.conflictStates = []
  }
}
export const conflictModal = new ConflictModalState(settingModal)

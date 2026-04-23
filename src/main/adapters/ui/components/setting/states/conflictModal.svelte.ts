import type { URLTitleConfliction } from "@domain/entities/URLTitleCollection"
import { settingModal, type SettingModalState } from "./settingModal.svelte"

export class ConflictModalState {
  show = $state(false)
  conflictions: URLTitleConfliction[] = $state([])
  constructor(settingModalState: SettingModalState) {
    $effect.root(() => {
      $effect(() => {
        // close modal when setting is closed?
        if (settingModalState.show === false) this.show = false
      })
    })
  }
}
export const conflictModal = new ConflictModalState(settingModal)

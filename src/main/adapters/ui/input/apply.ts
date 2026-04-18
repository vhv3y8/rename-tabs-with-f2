import type { ApplyUseCase } from "@main/application/usecases/apply"
import {
  cancelApplyKeydown,
  keydowns,
} from "../components/reactivity/keys.svelte"
import { settingModal } from "../components/setting/states/settingModal.svelte"

export function createKeydownApplyHandler(apply: ApplyUseCase) {
  return function keydownApplyHandler(e: KeyboardEvent) {
    if (settingModal.listen) return

    switch (e.key) {
      case "Enter": {
        e.preventDefault()
        if (e.ctrlKey) {
          apply()
        }
      }
      default: {
        if (e.ctrlKey) {
          keydowns.ctrlEnter = true
        } else {
          cancelApplyKeydown()
        }
      }
    }
  }
}

export function createClickApplyHandler(apply: ApplyUseCase) {
  return function clickApplyHandler(e: MouseEvent) {
    apply()
  }
}

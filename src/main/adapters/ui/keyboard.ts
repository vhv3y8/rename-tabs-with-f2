import { apply } from "@main/application/usecases/apply"
import { settingModal } from "./setting/settingModal.svelte"
import {
  cancelAllKeydowns,
  cancelApplyKeydown,
  keydowns,
} from "./reactivity/keys.svelte"

export function keydownGlobalHandler(e: KeyboardEvent) {
  if (settingModal.listen) return

  switch (e.key) {
    // apply
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

export function keyupGlobalHandler() {
  cancelAllKeydowns()
}

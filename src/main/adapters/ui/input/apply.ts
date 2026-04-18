import {
  cancelApplyKeydown,
  keydowns,
} from "../components/reactivity/keys.svelte"
import { settingModal } from "../components/setting/states/settingModal.svelte"

export function keydownApplyHandler(e: KeyboardEvent) {
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

export function clickApplyHandler(e: MouseEvent) {
  apply()
}

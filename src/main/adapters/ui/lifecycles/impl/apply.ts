import type { ApplyLifeCycle } from "@main/application/usecases/apply"

export const DOMApplyLifeCycle: ApplyLifeCycle = {
  beforeStart() {
    // trigger change event for focused element to apply input changes
    document.activeElement?.dispatchEvent(
      new Event("change", { bubbles: true }),
    )
  },
  closePageAfterFinish() {
    window.close()
  },
}

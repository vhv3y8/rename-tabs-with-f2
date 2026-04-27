import type { Attachment } from "svelte/attachments"

export type TooltipItem = {
  id: number
  content: string
}

export class TooltipGenerator {
  list: TooltipItem[] = $state([])
  private timers: Map<number, ReturnType<typeof setTimeout>> = new Map()
  private nextId = 1
  constructor() {}

  attachTooltip(content: string): Attachment {
    const tooltipId = this.nextId
    this.nextId += 1

    function mouseEnterHandler() {}
    function mouseLeaveHandler() {}

    return (element: Element) => {
      element.addEventListener("mouseenter", mouseEnterHandler)
      element.addEventListener("mouseleave", mouseLeaveHandler)
      return () => {
        element.removeEventListener("mouseenter", mouseEnterHandler)
        element.removeEventListener("mouseleave", mouseLeaveHandler)
      }
    }
  }

  // publishToast(content: string, duration?: number): number {
  //   const toastId = this.nextId
  //   console.log("[appending toast]", "[given duration]", duration, {
  //     id: toastId,
  //     content,
  //     duration: duration || this.DURATION,
  //   })

  //   this.list.unshift({
  //     id: toastId,
  //     content,
  //     duration: duration || this.DURATION,
  //   })
  //   // add timer
  //   if (!this.timers.has(toastId)) {
  //     const timer = setTimeout(
  //       () => this.removeToast(toastId),
  //       duration || this.DURATION,
  //     )
  //     this.timers.set(toastId, timer)
  //   }
  //   this.nextId += 1
  //   return toastId
  // }
  // removeToast(id: number) {
  //   const idx = this.list.findIndex((item) => item.id === id)
  //   if (-1 < idx) {
  //     this.list.splice(idx, 1)
  //     // remove timer if exists
  //     if (this.timers.has(id)) {
  //       const timer = this.timers.get(id)
  //       clearTimeout(timer)
  //       this.timers.delete(id)
  //     }
  //   }
  // }
  // getAll() {
  //   return this.list
  // }

  renderTooltip() {
    //
  }
}
export const tooltips = new TooltipGenerator()

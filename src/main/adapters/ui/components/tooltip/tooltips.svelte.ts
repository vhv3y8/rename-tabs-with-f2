import { autoUpdate, computePosition, flip, offset } from "@floating-ui/dom"
import type { Attachment } from "svelte/attachments"

export type TooltipItem = {
  id: number
  content: string
  tooltipElem: HTMLElement | null
  parentClientWidth: number
}
export type TooltipRecord = Record<number, TooltipItem>

export class TooltipGenerator {
  record: TooltipRecord = $state({})
  private nextId = 1
  constructor() {}

  attachEllipsisTooltip(content: string): Attachment {
    const tooltipId = this.nextId
    this.nextId += 1

    return (element: Element) => {
      let cleanupFloating: (() => void) | undefined

      const mouseEnterHandler = () => {
        if (import.meta.env.MODE === "development")
          console.log(
            "[mouse enter] [parent element] [scroll width]",
            element,
            element.clientWidth,
          )
        this.record[tooltipId] = {
          id: tooltipId,
          content,
          tooltipElem: null,
          parentClientWidth: element.clientWidth,
        }
      }

      const mouseLeaveHandler = () => {
        if (import.meta.env.MODE === "development") console.log("[mouse leave]")
        if (cleanupFloating) cleanupFloating()
        delete this.record[tooltipId]
      }

      // $effect(() => {
      //   const data = this.record[tooltipId]
      //   const ellipsisCheckElem = element.querySelector(".ellipsisCheck")
      //   if (ellipsisCheckElem)
      //     console.log(
      //       "[clientWidth, scrollWidth, compare]",
      //       element,
      //       ellipsisCheckElem,
      //       {
      //         clientWidth: ellipsisCheckElem.clientWidth,
      //         scrollWidth: ellipsisCheckElem.scrollWidth,
      //         compare:
      //           ellipsisCheckElem.clientWidth >= ellipsisCheckElem.scrollWidth,
      //       },
      //     )
      //   if (
      //     data &&
      //     ellipsisCheckElem &&
      //     ellipsisCheckElem.clientWidth >= ellipsisCheckElem.scrollWidth
      //   ) {
      //     delete this.record[tooltipId]
      //   }
      // })

      $effect(() => {
        const data = this.record[tooltipId]
        const tooltipElem = data?.tooltipElem
        if (import.meta.env.MODE === "development")
          console.log("[tooltip effect] [tooltipElem]", tooltipElem)

        if (tooltipElem && !cleanupFloating) {
          if (import.meta.env.MODE === "development")
            console.log("[setting auto update]")
          cleanupFloating = autoUpdate(element, tooltipElem, () => {
            if (import.meta.env.MODE === "development")
              console.log("[auto update]")

            computePosition(element, tooltipElem, {
              placement: "top",
              middleware: [offset(6), flip()],
            }).then(({ x, y }) => {
              if (import.meta.env.MODE === "development")
                console.log("[compute position] [x, y]", [x, y])

              Object.assign(tooltipElem.style, {
                left: `${x}px`,
                top: `${y}px`,
              })
            })
          })
        }

        return () => {
          if (cleanupFloating) {
            cleanupFloating()
            cleanupFloating = undefined
          }
        }
      })

      element.addEventListener("mouseenter", mouseEnterHandler)
      element.addEventListener("mouseleave", mouseLeaveHandler)

      return () => {
        if (cleanupFloating) cleanupFloating()
        delete this.record[tooltipId]
        element.removeEventListener("mouseenter", mouseEnterHandler)
        element.removeEventListener("mouseleave", mouseLeaveHandler)
      }
    }
  }
}
export const tooltips = new TooltipGenerator()

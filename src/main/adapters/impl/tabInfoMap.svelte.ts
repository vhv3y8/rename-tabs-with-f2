import type { TabInfoStore } from "../../application/ports/TabInfoStore"
import type { TabInfo } from "../../domain/entities/TabInfo"

export class TabInfoMap implements TabInfoStore {
  getById(tabId: number): TabInfo | null {
    return null
  }
}

export const tabIdxToInfo = new TabInfoMap()

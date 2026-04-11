import { type TabInfo } from "../../domain/entities/TabInfo"

export interface TabInfoStore {
  getById(tabId: number): TabInfo | null
}

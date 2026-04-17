import type { TabInfoStore } from "@application/ports/TabInfoStore"
import { TabIdxInfoRecord } from "../states/tabInfoRecord.svelte"
import { NotConnectedTabLists } from "../states/notConnected.svelte"

export class TabIdxInfoRecordStore
  extends TabIdxInfoRecord
  implements TabInfoStore
{
  // separate not connected tabs class for readability
  notConnected: NotConnectedTabLists
  constructor() {
    super()
    this.notConnected = new NotConnectedTabLists(this)
  }
  getTabIdsToReload() {
    return this.notConnected.getTabIdsToReload()
  }
}

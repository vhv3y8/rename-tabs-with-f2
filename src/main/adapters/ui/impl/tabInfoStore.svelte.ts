import type { TabInfoStore } from "@main/application/ports/TabInfoStore"
import { TabIdxInfoRecord } from "../components/tabs/states/tabInfoRecord.svelte"
import { NotConnectedTabLists } from "../components/tabs/states/notConnected.svelte"

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

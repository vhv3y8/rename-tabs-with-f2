import type { TabInfoStore } from "@main/application/ports/TabInfoStore"
import { TabIdxInfoRecord } from "../components/tabs/states/tabInfoRecord.svelte"
import { NotConnectedTabInfoLists } from "../components/tabs/states/notConnected.svelte"

export class TabIdxInfoRecordStore
  extends TabIdxInfoRecord
  implements TabInfoStore
{
  // separate not connected tab infos class for readability
  notConnected: NotConnectedTabInfoLists
  constructor() {
    super()
    this.notConnected = new NotConnectedTabInfoLists(this)
  }
  getTabIdsToReload() {
    return this.notConnected.getTabIdsToReload()
  }
}

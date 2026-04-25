import type { IdCollectionStore } from "@sw/application/ports/IdCollectionStore"
import type { PlatformSWFacade } from "@sw/application/ports/infra/PlatformSWFacade"

// session storage
// export class IdCollectionStoreImpl implements IdCollectionStore {
//   extensionTabIdCollection: Set<number> = new Set()
//   windowIdLastFocusTabIdCollection: Map<number, number> = new Map()
//   private constructor(private extensionFacade: PlatformSWFacade) {}
//   static async build(extensionFacade: PlatformSWFacade) {
//     const idCollectionRecord = await extensionFacade.getIdCollections()
//     const titleApplyingRecord = await extensionFacade.getTitleApplyingInfos()
//   }
//   private async setIdCollections() {
//     await this.extensionFacade.setIdCollections(
//       Array.from(this.extensionTabIdCollection),
//     )
//   }

//   // extension main page tab
//   async isMainPageTab(tabId: number) {
//     return false
//   }
//   async setMainPageTabId(tabId: number) {}
//   async removeMainPageTabId(tabId: number) {}

//   // last focus tab
//   async setLastFocusTabId(windowId: number, lastFocusTabId: number) {}
//   async getLastFocusTabId() {
//     return -1
//   }
//   async windowHasLastFocusTab(windowId: number) {
//     return false
//   }
//   async removeLastFocusTabId(id: number) {}
// }

export class IdCollectionStoreImpl implements IdCollectionStore {
  extensionTabIdCollection: ExtensionTabIdSet
  windowIdLastFocusTabIdCollection: WindowIdLastFocusTabIdMap
  private constructor(private extensionFacade: PlatformSWFacade) {}
  static async build(extensionFacade: PlatformSWFacade) {
    const idCollectionRecord = await extensionFacade.getIdCollections()
    const titleApplyingRecord = await extensionFacade.getTitleApplyingInfos()
  }
  private async setIdCollections() {
    await this.extensionFacade.setIdCollections(
      Array.from(this.extensionTabIdCollection),
    )
  }

  // extension main page tab
  async isMainPageTab(tabId: number) {
    return this.extensionTabIdCollection.isMainPageTab(tabId)
  }
  async setMainPageTabId(tabId: number) {
    return this.extensionTabIdCollection.setMainPageTabId(tabId)
  }
  async removeMainPageTabId(tabId: number) {
    return this.extensionTabIdCollection.removeMainPageTabId(tabId)
  }

  // last focus tab
  async setLastFocusTabId(windowId: number, lastFocusTabId: number) {
    return this.windowIdLastFocusTabIdCollection.setLastFocusTabId(
      windowId,
      lastFocusTabId,
    )
  }
  async getLastFocusTabId() {
    return this.windowIdLastFocusTabIdCollection.getLastFocusTabId()
  }
  async windowHasLastFocusTab(windowId: number) {
    return this.windowIdLastFocusTabIdCollection.windowHasLastFocusTab(windowId)
  }
  async removeLastFocusTabId(id: number) {
    return this.windowIdLastFocusTabIdCollection.removeLastFocusTabId(id)
  }
}

export class ExtensionTabIdSet implements Partial<IdCollectionStore> {
  tabIdSet: Set<number>
  //
  async isMainPageTab(tabId: number) {
    return false
  }
  async setMainPageTabId(tabId: number) {}
  async removeMainPageTabId(tabId: number) {}
}

export class WindowIdLastFocusTabIdMap implements Partial<IdCollectionStore> {
  winIdTabIdMap: Map<number, number>
  // last focus tab
  async setLastFocusTabId(windowId: number, lastFocusTabId: number) {}
  async getLastFocusTabId() {
    return -1
  }
  async windowHasLastFocusTab(windowId: number) {
    return false
  }
  async removeLastFocusTabId(id: number) {}
}

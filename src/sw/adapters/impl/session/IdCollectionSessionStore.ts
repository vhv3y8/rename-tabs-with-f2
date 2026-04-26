import type { IdCollectionStore } from "@sw/application/ports/IdCollectionStore"
import type {
  IdCollectionRecord,
  PlatformSWFacade,
} from "@sw/application/ports/infra/PlatformSWFacade"

export class IdCollectionSessionStore implements IdCollectionStore {
  private constructor(
    public extensionTabIdCollection: ExtensionTabIdSet,
    public windowIdLastFocusTabIdCollection: WindowIdLastFocusTabIdMap,
    private extensionFacade: PlatformSWFacade,
  ) {}
  // use this to create instance
  static async build(extensionFacade: PlatformSWFacade) {
    const idCollectionRecord = await extensionFacade.getSessionIdCollections()
    return new IdCollectionSessionStore(
      new ExtensionTabIdSet(idCollectionRecord.extensionTabIdCollection),
      new WindowIdLastFocusTabIdMap(
        idCollectionRecord.windowIdLastFocusTabIdCollection,
      ),
      extensionFacade,
    )
  }
  // fetch and sync session
  async fetchIdCollections() {
    const fetched: IdCollectionRecord =
      await this.extensionFacade.getSessionIdCollections()
    this.extensionTabIdCollection.resetFromStorageValue(
      fetched.extensionTabIdCollection,
    )
    this.windowIdLastFocusTabIdCollection.resetFromStorageValue(
      fetched.windowIdLastFocusTabIdCollection,
    )
  }
  // always sync after value update
  async syncIdCollections() {
    const storageFormat: IdCollectionRecord = {
      extensionTabIdCollection: this.extensionTabIdCollection.toStorageValue(),
      windowIdLastFocusTabIdCollection:
        this.windowIdLastFocusTabIdCollection.toStorageValue(),
    }
    await this.extensionFacade.setSessionIdCollections(storageFormat)
  }

  // extension main page tab
  async isMainPageTab(tabId: number) {
    return this.extensionTabIdCollection.isMainPageTab(tabId)
  }
  async setMainPageTabId(tabId: number) {
    await this.extensionTabIdCollection.setMainPageTabId(tabId)
    await this.syncIdCollections()
  }
  async removeMainPageTabId(tabId: number) {
    await this.extensionTabIdCollection.removeMainPageTabId(tabId)
    await this.syncIdCollections()
  }

  // last focus tab
  async setLastFocusTabId(windowId: number, lastFocusTabId: number) {
    await this.windowIdLastFocusTabIdCollection.setLastFocusTabId(
      windowId,
      lastFocusTabId,
    )
    await this.syncIdCollections()
  }
  async getLastFocusTabId(windowId: number) {
    return this.windowIdLastFocusTabIdCollection.getLastFocusTabId(windowId)
  }
  async windowHasLastFocusTab(windowId: number) {
    return this.windowIdLastFocusTabIdCollection.windowHasLastFocusTab(windowId)
  }
  async removeLastFocusTabId(tabId: number) {
    await this.windowIdLastFocusTabIdCollection.removeLastFocusTabId(tabId)
    await this.syncIdCollections()
  }
}

export class ExtensionTabIdSet implements Partial<IdCollectionStore> {
  tabIdSet: Set<number>
  constructor(storageValue: IdCollectionRecord["extensionTabIdCollection"]) {
    this.tabIdSet = new Set(storageValue)
  }
  resetFromStorageValue(
    storageValue: IdCollectionRecord["extensionTabIdCollection"],
  ) {
    this.tabIdSet = new Set(storageValue)
  }
  toStorageValue() {
    return Array.from(this.tabIdSet)
  }

  async isMainPageTab(tabId: number) {
    return this.tabIdSet.has(tabId)
  }
  async setMainPageTabId(tabId: number) {
    this.tabIdSet.add(tabId)
  }
  async removeMainPageTabId(tabId: number) {
    this.tabIdSet.delete(tabId)
  }
}

export class WindowIdLastFocusTabIdMap implements Partial<IdCollectionStore> {
  winIdTabIdMap: Map<number, number>
  constructor(
    storageValue: IdCollectionRecord["windowIdLastFocusTabIdCollection"],
  ) {
    this.winIdTabIdMap = new Map(storageValue)
  }
  resetFromStorageValue(
    storageValue: IdCollectionRecord["windowIdLastFocusTabIdCollection"],
  ) {
    this.winIdTabIdMap = new Map(storageValue)
  }
  toStorageValue() {
    return Array.from(this.winIdTabIdMap)
  }

  async setLastFocusTabId(windowId: number, lastFocusTabId: number) {
    this.winIdTabIdMap.set(windowId, lastFocusTabId)
  }
  async getLastFocusTabId(windowId: number) {
    return this.winIdTabIdMap.get(windowId) || null
  }
  async windowHasLastFocusTab(windowId: number) {
    return this.winIdTabIdMap.has(windowId)
  }
  async removeLastFocusTabId(tabId: number) {
    this.winIdTabIdMap.delete(tabId)
  }
}

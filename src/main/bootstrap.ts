import type { URLTitleCollectionStore } from "@application/ports/URLTitleCollectionStore"
import { InMemorySetting } from "./adapters/ui/components/setting/states/inMemorySetting.svelte"
import { DOMApplyLifeCycle } from "./adapters/ui/impl/lifecycles/applyLifeCycle"
import { createChromeSvelteReloadLifeCycle } from "./adapters/ui/impl/lifecycles/reloadLifeCycle"
import { TabIdxInfoRecordStore } from "./adapters/ui/impl/tabInfoStore.svelte"
import { Toasts } from "./adapters/ui/impl/toastPublisher.svelte"
import {
  createClickApplyHandler,
  createKeydownApplyHandler,
} from "./adapters/ui/input/apply"
import {
  createClickReloadUseCaseHandler,
  createKeydownReloadUseCaseHandler,
} from "./adapters/ui/input/reload"
import type { PlatformMainFacade } from "./application/ports/infra/PlatformMainFacade"
import type { ToastPublisher } from "./application/ports/infra/ToastPublisher"
import type { TabInfoStore } from "./application/ports/TabInfoStore"
import {
  createApplyUseCase,
  type ApplyLifeCycle,
  type ApplyUseCase,
} from "./application/usecases/apply"
import {
  createCheckAllTabConnectionAndUpdateFlags,
  type CheckAllTabConnectionUseCase,
} from "./application/usecases/checkAllTabConnection"
import {
  createReloadAllConnectableTabs,
  type ReloadAllConnectableTabsUseCase,
  type ReloadLifeCycle,
} from "./application/usecases/reloadAllConnectableTabs"
import { ChromeMainFacade } from "./infra/platform/impl/ChromeMainFacade"
import {
  createExportURLTitleCollectionFile,
  type ExportURLTitleCollectionFileUseCase,
} from "@application/usecases/file/exportURLTitleCollectionFile"
import type { Serializer } from "@application/ports/infra/Serializer"
import type { URLTitleCollection } from "@domain/entities/URLTitleCollection"
import { URLTitleRecordJSONCodec } from "@infra/web/impl/JSONCodec"
import { uploadURLTitleLifeCycle } from "@adapters/ui/impl/lifecycles/uploadURLTitleLifeCycle"
import {
  createClearURLTitleFileClickHandler,
  createExportURLTitleFileClickHandler,
  DOMURLTitleFileUploadHandler,
} from "@adapters/ui/input/files"
import type { FileExporter } from "@application/ports/infra/FileExporter"
import { WebTextFileExporter } from "@infra/web/impl/WebFileExporter"
import {
  createUploadURLTitleCollection,
  type UploadURLTitleCollectionLifeCycle,
  type UploadURLTitleCollectionUseCase,
} from "@application/usecases/file/uploadURLTitleCollection"
import { URLTitleRecordStore } from "@adapters/impl/URLTitleRecordStore"
import type { SettingStore } from "@application/ports/SettingStore"
import { TabItemComponents } from "@adapters/ui/components/tabs/states/tabItemComponents.svelte"
import type { TabInfo } from "@domain/entities/TabInfo"
import type { OriginalTitleStore } from "@application/ports/OriginalTitleStore"
import { OriginalTitleRecordStore } from "@adapters/impl/OriginalTitleRecordStore"
import {
  createClearURLTitleCollection,
  type ClearURLTitleCollectionUseCase,
} from "@application/usecases/file/clearURLTitleCollection"

export async function runBootstrap() {
  // create infra impl

  const extensionFacade = new ChromeMainFacade() satisfies PlatformMainFacade
  const toastPublisher: ToastPublisher = new Toasts()

  const urlTitleCollectionJSONSerializer: Serializer<
    URLTitleCollection,
    string
  > = new URLTitleRecordJSONCodec()
  const urlTitleCollectionFileExporter: FileExporter<URLTitleCollection> =
    new WebTextFileExporter(
      urlTitleCollectionJSONSerializer,
      "application/json",
      "RenameTabsWithF2-TitlesData.json",
    )

  // create output adapter impl

  const urlTitleCollectionStore: URLTitleCollectionStore =
    await URLTitleRecordStore.build(extensionFacade)

  const tabIdxInfoStore = new TabIdxInfoRecordStore() satisfies TabInfoStore
  const notConnected = tabIdxInfoStore.notConnected

  const originalTitleStore: OriginalTitleStore =
    await OriginalTitleRecordStore.build(extensionFacade)

  const inMemorySetting = (await InMemorySetting.build(
    extensionFacade,
  )) satisfies SettingStore

  // create dirty impls

  const tabItemComponents = await TabItemComponents.build(extensionFacade)

  // create lifecycle impl and use cases

  // apply
  const applyLifeCycle: ApplyLifeCycle = DOMApplyLifeCycle
  const applyUseCase: ApplyUseCase = createApplyUseCase(
    tabIdxInfoStore,
    urlTitleCollectionStore,
    inMemorySetting,
    extensionFacade,
    applyLifeCycle,
  )

  // check all tab connection
  const checkAllTabConnectionAndUpdateFlagsUseCase: CheckAllTabConnectionUseCase =
    createCheckAllTabConnectionAndUpdateFlags(tabIdxInfoStore, extensionFacade)
  // reload
  const reloadLifeCycle: ReloadLifeCycle = createChromeSvelteReloadLifeCycle(
    tabIdxInfoStore,
    tabItemComponents,
    checkAllTabConnectionAndUpdateFlagsUseCase,
  )
  const reloadAllConnectableTabsUseCase: ReloadAllConnectableTabsUseCase =
    createReloadAllConnectableTabs(
      tabIdxInfoStore,
      extensionFacade,
      checkAllTabConnectionAndUpdateFlagsUseCase,
      reloadLifeCycle,
    )

  // files
  const exportURLTitleCollectionFileUseCase: ExportURLTitleCollectionFileUseCase =
    createExportURLTitleCollectionFile(
      urlTitleCollectionStore,
      urlTitleCollectionFileExporter,
    )
  const clearURLTitleCollectionUseCase: ClearURLTitleCollectionUseCase =
    createClearURLTitleCollection(urlTitleCollectionStore, toastPublisher)
  const uploadURLTitleCollectionLifeCycle: UploadURLTitleCollectionLifeCycle =
    uploadURLTitleLifeCycle
  const uploadURLTitleCollectionFileUseCase: UploadURLTitleCollectionUseCase =
    createUploadURLTitleCollection(
      urlTitleCollectionStore,
      toastPublisher,
      uploadURLTitleCollectionLifeCycle,
    )

  // create input adapters

  // apply
  const keydownApplyHandler = createKeydownApplyHandler(applyUseCase)
  const clickApplyHandler = createClickApplyHandler(applyUseCase)
  // reload
  const keydownReloadUseCaseHandler = createKeydownReloadUseCaseHandler(
    reloadAllConnectableTabsUseCase,
    notConnected,
  )
  const clickReloadUseCaseHandler = createClickReloadUseCaseHandler(
    reloadAllConnectableTabsUseCase,
  )
  // files
  const urlTitleFileUploadHandler = new DOMURLTitleFileUploadHandler(
    urlTitleCollectionJSONSerializer,
    uploadURLTitleCollectionFileUseCase,
    toastPublisher,
  )
  const clickExportUrlTitleFileHandler = createExportURLTitleFileClickHandler(
    exportURLTitleCollectionFileUseCase,
  )
  const clearURLTitleFileClickHandler = createClearURLTitleFileClickHandler(
    clearURLTitleCollectionUseCase,
  )

  // run initializations

  const tabsToInitialize = await extensionFacade.getInitializeTabEntries()
  const urlTitleCollection = await urlTitleCollectionStore.getCollection()
  const tabIdOriginalTitleLookup =
    await originalTitleStore.getOriginalTitlesFromTabIds(
      tabsToInitialize.map(({ id }) => id).filter((id) => id !== undefined),
    )
  // TODO
  // if should apply titles is false, give null for persisted / original
  const tabInfos: TabInfo[] = tabsToInitialize.map(
    ({ id, title, favIconUrl, url, index, status }) => ({
      index,
      id: id!,
      title: title!,
      favIconUrl: favIconUrl!,
      url: url!,
      status: status!,
      persistedTitle: url ? urlTitleCollection.getTitle(url) : null,
      originalTitle: id ? tabIdOriginalTitleLookup[id] : null,
      connected: false,
    }),
  )
  console.log("[initializing] [tab infos]", tabInfos)
  tabIdxInfoStore.clearAndSetTabInfos(tabInfos)

  await checkAllTabConnectionAndUpdateFlagsUseCase()
  // tabItemComponents.focusInitialItem()

  // registering input adapters are delegated to svelte components
  return {
    toasts: toastPublisher,
    // adapter only
    tabItemComponents,
    // output adapters
    tabIdxInfoStore,
    notConnected,
    setting: inMemorySetting.setting,
    // input adapters
    keydownApplyHandler,
    clickApplyHandler,
    keydownReloadUseCaseHandler,
    clickReloadUseCaseHandler,
    urlTitleFileUploadHandler,
    clickExportUrlTitleFileHandler,
    clearURLTitleFileClickHandler,
  }
}

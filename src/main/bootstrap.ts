import type { URLTitleCollectionStore } from "@application/ports/URLTitleCollectionStore"
import { InMemorySetting } from "./adapters/ui/components/setting/states/inMemorySetting.svelte"
import { DOMApplyLifeCycle } from "./adapters/ui/impl/lifecycles/applyLifeCycle"
import { createInitializeAppLifeCycle } from "./adapters/ui/impl/lifecycles/initializeAppLifeCycle"
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
  createInitializeAppUseCase,
  type InitializeAppLifeCycle,
  type InitializeAppUseCase,
} from "./application/usecases/initialize/initializeApp"
import {
  createInitializeTabInfoStore,
  type InitializeTabInfoStoreUseCase,
} from "./application/usecases/initialize/initializeTabInfoStore"
import {
  createReloadAllConnectableTabs,
  type ReloadAllConnectableTabsUseCase,
  type ReloadLifeCycle,
} from "./application/usecases/reloadAllConnectableTabs"
import { ChromeMainFacade } from "./infra/platform/impl/ChromeMainFacade"
import { URLTitleCollectionStoreImpl } from "@adapters/impl/urlTitleCollectionStoreImpl"
import {
  createInitializeURLTitleCollectionStore,
  type InitializeURLTitleCollectionStoreUseCase,
} from "@application/usecases/initialize/initializeURLTitleCollectionStore"
import {
  createExportURLTitleCollectionFile,
  type ExportURLTitleCollectionFileUseCase,
} from "@application/usecases/file/exportURLTitleCollectionFile"
import type { Serializer } from "@application/ports/infra/Serializer"
import { WebAPITextFileStorage } from "@infra/web/impl/WebAPITextFileStorage"
import type { URLTitleCollection } from "@domain/entities/URLTitleCollection"
import { URLTitleRecordJSONCodec } from "@infra/web/impl/JSONCodec"
import type { FileStorage } from "@application/ports/infra/FileStorage"
import {
  createUploadURLTitleCollectionFile,
  type UploadURLTitleCollectionFileUseCase,
  type UploadURLTitleFileLifeCycle,
} from "@application/usecases/file/uploadURLTitleCollectionFile"
import { uploadURLTitleLifeCycle } from "@adapters/ui/impl/lifecycles/uploadURLTitleLifeCycle"

export async function runBootstrap() {
  // create infra impl

  const extensionFacade = new ChromeMainFacade() satisfies PlatformMainFacade
  const toastPublisher: ToastPublisher = new Toasts()

  const urlTitleCollectionJSONSerializer: Serializer<
    URLTitleCollection,
    string
  > = new URLTitleRecordJSONCodec()
  const urlTitleCollectionFileStorage: FileStorage<URLTitleCollection> =
    new WebAPITextFileStorage(urlTitleCollectionJSONSerializer)

  // create output adapter impl

  const tabIdxInfoStore = new TabIdxInfoRecordStore() satisfies TabInfoStore
  const notConnected = tabIdxInfoStore.notConnected
  const urlTitleCollectionStore: URLTitleCollectionStore =
    new URLTitleCollectionStoreImpl(extensionFacade)
  // adapter only impl?
  const inMemorySetting = await InMemorySetting.build(extensionFacade)

  // create lifecycle impl and use cases

  // apply
  const applyLifeCycle: ApplyLifeCycle = DOMApplyLifeCycle
  const applyUseCase: ApplyUseCase = createApplyUseCase(
    tabIdxInfoStore,
    urlTitleCollectionStore,
    extensionFacade,
    applyLifeCycle,
  )
  // check all tab connection
  const checkAllTabConnectionAndUpdateFlagsUseCase: CheckAllTabConnectionUseCase =
    createCheckAllTabConnectionAndUpdateFlags(tabIdxInfoStore, extensionFacade)
  // reload
  const reloadLifeCycle: ReloadLifeCycle = createChromeSvelteReloadLifeCycle(
    tabIdxInfoStore,
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
      urlTitleCollectionFileStorage,
    )
  const uploadURLTitleCollectionFileLifeCycle: UploadURLTitleFileLifeCycle =
    uploadURLTitleLifeCycle
  const uploadURLTitleCollectionFileUseCase: UploadURLTitleCollectionFileUseCase =
    createUploadURLTitleCollectionFile(
      urlTitleCollectionStore,
      urlTitleCollectionFileStorage,
      toastPublisher,
      uploadURLTitleCollectionFileLifeCycle,
    )

  // initializations
  // url title collection store
  const initializeURLTitleCollectionStoreUseCase: InitializeURLTitleCollectionStoreUseCase =
    createInitializeURLTitleCollectionStore(
      urlTitleCollectionStore,
      extensionFacade,
    )
  // tab info store
  const initializeTabInfoStoreUseCase: InitializeTabInfoStoreUseCase =
    createInitializeTabInfoStore(
      extensionFacade,
      urlTitleCollectionStore,
      tabIdxInfoStore,
    )
  // app
  const initializeAppLifeCycle: InitializeAppLifeCycle =
    createInitializeAppLifeCycle(extensionFacade)
  const initializeAppUseCase: InitializeAppUseCase = createInitializeAppUseCase(
    initializeURLTitleCollectionStoreUseCase,
    initializeTabInfoStoreUseCase,
    checkAllTabConnectionAndUpdateFlagsUseCase,
    initializeAppLifeCycle,
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

  // registering input adapters are delegated to svelte components

  // run initializing use cases
  await initializeAppUseCase()

  // detailed instances to DI into ui components
  return {
    toasts: toastPublisher,
    // output adapters
    tabIdxInfoStore,
    notConnected,
    setting: inMemorySetting.setting,
    // input adapters
    keydownApplyHandler,
    clickApplyHandler,
    keydownReloadUseCaseHandler,
    clickReloadUseCaseHandler,
  }
}

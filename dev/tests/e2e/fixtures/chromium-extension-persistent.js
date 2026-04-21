import { test as base, chromium } from "@playwright/test"
import path from "path"
import { fileURLToPath } from "url"
import fs from "node:fs"

export const extensionFolder = path.join(
  fileURLToPath(import.meta.url),
  "../../../../..",
  "dist",
)
export const extensionFolderV2 = path.join(extensionFolder, "../dist2")
export const userDataDir = "./.profiles/chromium-profile"

// adding fixtures

const commonChromeExtensionTest = base.extend({
  context: async ({}, use) => {
    console.log("[extensionFolder]", extensionFolder)
    const context = await chromium.launchPersistentContext(userDataDir, {
      channel: "chromium",
      args: [
        `--disable-extensions-except=${extensionFolder}`,
        `--load-extension=${extensionFolder}`,
      ],
    })

    const swUrls = context.serviceWorkers().map((sw) => sw.url())
    console.log("[service worker urls]", swUrls)

    await use(context)
    await context.close()
  },
  // for extension update tests
  createPersistentWithSW: async ({}, use) => {
    const createPersistent = async ({ extensionFolder }) => {
      // fs.rmSync(`${userDataDir}/Default/Extensions/`, {
      //   recursive: true,
      //   force: true,
      // })
      // fs.rmSync(`${userDataDir}/Default/Service Worker`, {
      //   recursive: true,
      //   force: true,
      // })
      // fs.rmSync(`${userDataDir}/Default/Extension State`, {
      //   recursive: true,
      //   force: true,
      // })

      console.log("[extensionFolder]", extensionFolder)
      const context = await chromium.launchPersistentContext(userDataDir, {
        args: [
          `--disable-extensions-except=${extensionFolder}`,
          `--load-extension=${extensionFolder}`,
        ],
      })

      const page = context.pages()[0]

      let [serviceWorker] = context.serviceWorkers()
      if (!serviceWorker)
        serviceWorker = await context.waitForEvent("serviceworker")

      return { context, page, extensionSW: serviceWorker }
    }
    await use(createPersistent)
  },

  // to prevent about:blank page
  page: async ({ context }, use) => {
    const page = context.pages()[0]
    await use(page)
  },
  cdpSession: async ({ context, page }, use) => {
    const client = await context.newCDPSession(page)
    await use(client)
  },

  extensionSW: async ({ context }, use) => {
    let [serviceWorker] = context.serviceWorkers()
    if (!serviceWorker)
      serviceWorker = await context.waitForEvent("serviceworker")

    await use(serviceWorker)
  },
  extensionSWSession: async ({ context, extensionSW }, use) => {
    const client = await context.newCDPSession(extensionSW)
    await use(client)
  },
  extensionId: async ({ extensionSW }, use) => {
    const extensionId = extensionSW.url().split("/")[2]
    await use(extensionId)
  },
})

const projectSpecificAddedTest = commonChromeExtensionTest.extend({
  // createSecondContext: async ({}, use) => {
  //   console.log("[extensionFolderV2]", extensionFolderV2)
  //   const createContext = async () => {
  //     const context = await chromium.launchPersistentContext(userDataDir, {
  //       channel: "chromium",
  //       args: [
  //         `--disable-extensions-except=${extensionFolderV2}`,
  //         `--load-extension=${extensionFolderV2}`,
  //       ],
  //     })
  //     return context
  //   }

  //   await use(createContext)
  //   // await context.close()
  // },
  // secondExtensionSW: async ({ createSecondContext }, use) => {
  //   const context = createSecondContext()
  //   console.log("[context.serviceWorkers()]", context.serviceWorkers())
  //   let [serviceWorker] = context.serviceWorkers()
  //   if (!serviceWorker)
  //     serviceWorker = await context.waitForEvent("serviceworker")

  //   await use(serviceWorker)
  // },

  gotoMainPage: async ({ page, extensionId }, use) => {
    // pass function to trigger goto
    await use(() =>
      page.goto(`chrome-extension://${extensionId}/main/index.html`),
    )
  },
})
// set timeout
// projectSpecificAddedTest.setTimeout(30000)

// export test and expect
export const test = projectSpecificAddedTest
export const expect = test.expect

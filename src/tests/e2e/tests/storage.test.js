import {
  expect,
  extensionFolder,
  extensionFolderV2,
  test,
  userDataDir,
} from "../fixtures/chromium-extension-persistent"
import { initialStorage } from "../../../lib/chrome/storage"
import { sleep } from "../helpers/utils"
import { gotoPages } from "../helpers/playwright"

test("default storage values", async ({ context, page, extensionSW }) => {
  const fullStorage = await extensionSW.evaluate(() =>
    chrome.storage.local.get(null),
  )
  console.log("[fullStorage]", fullStorage)
  expect(initialStorage).toEqual(fullStorage)

  const getSettingsResult = await extensionSW.evaluate(() =>
    chrome.storage.local.get(["settings"]).then((db) => db.settings),
  )
  console.log("[getSettingsResult]", getSettingsResult)
  expect(initialStorage.settings).toEqual(getSettingsResult)
  expect(initialStorage.settings.shortcut).toEqual(getSettingsResult.shortcut)
})

test("can overwrite chrome.storage with extensionSW.evaluate()", async ({
  extensionSW,
}) => {
  let userStorage = await extensionSW.evaluate(() =>
    chrome.storage.local.get(null),
  )
  expect(userStorage).toEqual(initialStorage)

  await extensionSW.evaluate(() =>
    chrome.storage.local.set({
      settings: {
        SomeNewBoolean: true,
        SomeNewString: "hi",
        darkmode: true,
        largerWidth: true,
        shortcut: {
          ctrlKey: true,
          altKey: true,
          metaKey: true,
          shiftKey: true,
          key: "Q",
        },
      },
    }),
  )

  userStorage = await extensionSW.evaluate(() => chrome.storage.local.get(null))
  expect(userStorage).toEqual({
    settings: {
      SomeNewBoolean: true,
      SomeNewString: "hi",
      darkmode: true,
      largerWidth: true,
      shortcut: {
        ctrlKey: true,
        altKey: true,
        metaKey: true,
        shiftKey: true,
        key: "Q",
      },
    },
  })
})

test("second version (dist2) only", async ({ createPersistentWithSW }) => {
  let { context, extensionSW } = await createPersistentWithSW({
    extensionFolder: extensionFolderV2,
  })
  const page = context.pages()[0]
  const mainPageUrl = extensionSW.url().split("/")[2]
  // console.log("[extensionSW]", extensionSW)

  // const firstFullStorage = await extensionSW.evaluate(() =>
  //   chrome.storage.local.get(null),
  // )
  // console.log("[firstFullStorage]", firstFullStorage)

  // open extension page for runtime listen
  await page.goto(`chrome-extension://${mainPageUrl}/test-bridge.html`)

  page.on("console", (msg) => {
    console.log("FROM SW:", msg.text())
  })

  await sleep(1000)

  await context.newPage()
  await context.newPage()
  const page2 = await context.newPage()
  await page2.goto("https://google.com")
  await page2.keyboard.press("F2")
  await page2.keyboard.press("Control+Alt+Meta+Shift+Q")
})

test("migration", async ({ createPersistentWithSW }) => {
  let { context, extensionSW } = await createPersistentWithSW({
    extensionFolder,
  })
  const extensionId = extensionSW.url().split("/")[2]

  const firstFullStorage = await extensionSW.evaluate(() =>
    chrome.storage.local.get(null),
  )
  console.log("[firstFullStorage]", structuredClone(firstFullStorage))

  await context.close()
  ;({ context, extensionSW } = await createPersistentWithSW({
    extensionFolder: extensionFolderV2,
  }))

  // await sleep(1000)

  const secondFullStorage = await extensionSW.evaluate(() =>
    chrome.storage.local.get(null),
  )
  console.log("[secondFullStorage]", structuredClone(secondFullStorage))

  const page = context.pages()[0]
  await page.goto("https://github.com")

  const [extensionPage] = await Promise.all([
    context.waitForEvent("page"),
    page.keyboard.press("F2"),
  ])
  const settingsBtn = await extensionPage.locator("#settingsPopoverBtn")
  await settingsBtn.click()
  // settingsPopoverBtn
})

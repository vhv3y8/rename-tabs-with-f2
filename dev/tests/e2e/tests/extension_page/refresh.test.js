import {
  test,
  expect,
  extensionFolder,
} from "../../fixtures/chromium-extension-persistent"
import { gotoPages } from "../../helpers/playwright"
import { defaultShortcutF2 } from "../../../../lib/chrome/storage"
import { sleep } from "../../helpers/utils"

test.beforeAll(async ({ extensionSW }) => {
  // expect storage shortcut to be F2
  const userStorage = await extensionSW.evaluate(() =>
    chrome.storage.local.get(null),
  )
  expect(userStorage.settings.shortcut).toEqual(defaultShortcutF2)
})

test("basic", async ({ context, page, extensionSW }) => {
  await gotoPages({
    context,
    page,
    urls: ["https://example.com/", "https://www.wikipedia.org"],
    synchronously: true,
  })
  const firstPage = context.pages()[0]

  // open extension page
  await firstPage.bringToFront()
  const [extensionPage] = await Promise.all([
    context.waitForEvent("page"),
    firstPage.keyboard.press("F2"),
  ])
  expect(extensionPage).toBeTruthy()

  await Promise.all([
    extensionPage.waitForLoadState("load"),
    // refresh
    extensionPage.reload(),
  ])

  // should focus extension page
  const focusedTabTitle = await extensionSW.evaluate(() =>
    chrome.tabs
      .query({ currentWindow: true, active: true })
      .then((tabs) => tabs[0].title),
  )
  expect(focusedTabTitle).toBe(await extensionPage.title())
})

test("test multi window with cdp session createTarget", async ({
  context,
  page,
  cdpSession,
}) => {
  await page.goto("https://google.com")

  const [newPage] = await Promise.all([
    context.waitForEvent("page"),
    cdpSession.send("Target.createTarget", {
      url: "https://www.wikipedia.org",
      newWindow: true,
      width: 800,
      height: 600,
    }),
  ])

  // (p) => p.context() === context && p.target()._targetId === targetId,
  console.log("[newPage]", await newPage.title())
})

test("multiple windows opened extension page", async ({
  context,
  page,
  cdpSession,
  extensionSW,
  extensionId,
}) => {
  // handle first window
  await gotoPages({
    context,
    page,
    urls: ["https://example.com/", "https://www.wikipedia.org"],
    synchronously: true,
  })
  const firstWinPage = context.pages()[0]

  // open second window
  const [secondWinPage] = await Promise.all([
    context.waitForEvent("page"),
    cdpSession.send("Target.createTarget", {
      url: "https://jsonplaceholder.typicode.com/",
      newWindow: true,
      width: 600,
      height: 600,
    }),
  ])
  expect(secondWinPage).toBeTruthy()
  await secondWinPage.waitForLoadState("domcontentloaded")
  // wait for content script to query storage
  await sleep(2000)

  // open extension page at first window
  await firstWinPage.bringToFront()
  const [firstExtensionPage] = await Promise.all([
    context.waitForEvent("page"),
    firstWinPage.keyboard.press("F2"),
  ])
  expect(firstExtensionPage).toBeTruthy()
  await firstExtensionPage.waitForEvent("domcontentloaded")

  // open extension page at second window
  await secondWinPage.bringToFront()
  const [secondExtensionPage] = await Promise.all([
    context.waitForEvent("page"),
    secondWinPage.keyboard.press("F2"),
  ])
  expect(secondExtensionPage).toBeTruthy()
  await secondExtensionPage.waitForEvent("domcontentloaded")

  // refresh and check first window extension page
  await firstExtensionPage.bringToFront()
  let tabIdBefore = await extensionSW.evaluate(() =>
    chrome.tabs
      .query({ currentWindow: true, active: true })
      .then((tabs) => tabs[0].id),
  )
  await firstExtensionPage.reload()
  let tabIdAfter = await extensionSW.evaluate(() =>
    chrome.tabs
      .query({ currentWindow: true, active: true })
      .then((tabs) => tabs[0].id),
  )
  expect(tabIdBefore).toBe(tabIdAfter)

  // refresh and check second window extension page
  await secondExtensionPage.bringToFront()
  tabIdBefore = await extensionSW.evaluate(() =>
    chrome.tabs
      .query({ currentWindow: true, active: true })
      .then((tabs) => tabs[0].id),
  )
  await secondExtensionPage.reload()
  tabIdAfter = await extensionSW.evaluate(() =>
    chrome.tabs
      .query({ currentWindow: true, active: true })
      .then((tabs) => tabs[0].id),
  )
  expect(tabIdBefore).toBe(tabIdAfter)
})

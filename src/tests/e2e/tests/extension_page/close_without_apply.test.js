import { test, expect } from "../../fixtures/chromium-extension-persistent"
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
    urls: ["https://github.com", "https://google.com"],
    synchronously: true,
  })
  const firstPage = context.pages()[0]

  // open extension page
  await firstPage.bringToFront()
  const [extensionPage] = await Promise.all([
    context.waitForEvent("page"),
    firstPage.keyboard.press("F2"),
  ])

  // close
  await Promise.all([
    extensionPage.waitForEvent("close"),
    extensionPage.close(),
  ])

  // should focus back to last focus tab
  const focusedTabTitle = await extensionSW.evaluate(() =>
    chrome.tabs
      .query({ currentWindow: true, active: true })
      .then((tabs) => tabs[0].title),
  )
  expect(focusedTabTitle).toBe(await firstPage.title())
})

test("last focus tab is content script unavailable", async ({
  context,
  page,
  extensionSW,
  extensionId,
}) => {
  await gotoPages({
    context,
    page,
    urls: ["chrome://newtab", "https://github.com", "https://google.com"],
    synchronously: true,
  })
  const newTabPage = context.pages()[0]

  // open extension page
  // cannot press extension icon at playwright
  let bridgePage = await context.newPage()
  await bridgePage.goto(`chrome-extension://${extensionId}/test-bridge.html`)
  // set new tab page as last focus tab
  await newTabPage.bringToFront()
  const [extensionPage] = await Promise.all([
    context.waitForEvent("page"),
    bridgePage.evaluate(() => {
      window.dispatchEvent(
        new CustomEvent("SEND_RUNTIME", {
          detail: {
            cmd: "OPEN",
          },
        }),
      )
    }),
  ])
  expect(extensionPage).toBeTruthy()

  // close extension page
  await extensionPage.close()

  // should focus back to last focus (content script unavailable) tab anyway
  const focusedTabTitle = await extensionSW.evaluate(() =>
    chrome.tabs
      .query({ currentWindow: true, active: true })
      .then((tabs) => tabs[0].title),
  )
  expect(focusedTabTitle).toBe(await newTabPage.title())
})

test("multiple windows opened extension page", async ({ context, page }) => {
  expect(true).toBe(false)
})

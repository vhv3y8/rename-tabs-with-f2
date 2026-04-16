import { test, expect } from "../../fixtures/chromium-extension-persistent"
import { defaultShortcutF2 } from "../../../../lib/chrome/storage"
import { dsCssPath, getDSVar, postcssParseFile } from "../../helpers/postcss"

test("darkmode", async ({ context, page, extensionSW }) => {
  const postRoot = await postcssParseFile(dsCssPath)
  await page.goto("https://google.com")

  // light mode

  let userStorage = await extensionSW.evaluate(async () =>
    chrome.storage.local.get(null),
  )
  expect(userStorage.settings.darkmode).toBe(false)

  // open extension page
  expect(userStorage.settings.shortcut).toEqual(defaultShortcutF2)
  const [extensionPage] = await Promise.all([
    context.waitForEvent("page"),
    page.keyboard.press("F2"),
  ])
  expect(extensionPage).toBeTruthy()

  await extensionPage.waitForLoadState("load")
  let bgVar = await extensionPage.evaluate(() => {
    const rootStyle = getComputedStyle(document.documentElement)
    return rootStyle.getPropertyValue("--bg")
  })
  expect(bgVar).toEqual(getDSVar({ postRoot, varName: "bg", darkmode: false }))

  // dark mode

  // update storage value
  await extensionSW.evaluate(async () => {
    const userStorage = await chrome.storage.local.get(null)
    userStorage.settings.darkmode = true
    await chrome.storage.local.set(userStorage)
  })
  // reload extension page
  await extensionPage.reload()
  await extensionPage.waitForLoadState("domcontentloaded")

  bgVar = await extensionPage.evaluate(() => {
    const rootStyle = getComputedStyle(document.documentElement)
    return rootStyle.getPropertyValue("--bg")
  })
  expect(bgVar).toEqual(getDSVar({ postRoot, varName: "bg", darkmode: true }))

  // TODO: remove?
  userStorage = await extensionSW.evaluate(async () =>
    chrome.storage.local.get(null),
  )
  expect(userStorage.settings.darkmode).toBe(true)
})

test("larger width", async ({ context, page, extensionSW }) => {
  const postRoot = await postcssParseFile(dsCssPath)
  await page.goto("https://google.com")

  // default width

  let userStorage = await extensionSW.evaluate(async () =>
    chrome.storage.local.get(null),
  )
  expect(userStorage.settings.largerWidth).toBe(false)

  // open extension page
  expect(userStorage.settings.shortcut).toEqual(defaultShortcutF2)
  const [extensionPage] = await Promise.all([
    context.waitForEvent("page"),
    page.keyboard.press("F2"),
  ])
  expect(extensionPage).toBeTruthy()

  await extensionPage.waitForLoadState("load")
  const main = await extensionPage.locator("main")

  let width = await main.evaluate(async (node) => {
    return getComputedStyle(node).width
  })
  expect(width).toEqual(
    getDSVar({ postRoot, varName: "width-normal", darkmode: false }),
  )

  // larger width

  // update storage value
  await extensionSW.evaluate(async () => {
    const userStorage = await chrome.storage.local.get(null)
    userStorage.settings.largerWidth = true
    await chrome.storage.local.set(userStorage)
  })
  // reload extension page
  await extensionPage.reload()
  await extensionPage.waitForLoadState("load")

  width = await main.evaluate(async (node) => {
    return getComputedStyle(node).width
  })
  expect(width).toEqual(
    getDSVar({ postRoot, varName: "width-large", darkmode: false }),
  )
})

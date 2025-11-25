import { test, expect } from "../../fixtures/chromium-extension-persistent"
import {
  defaultShortcutF2,
  initialStorage,
} from "../../../../lib/chrome/storage"
import { sleep } from "../../helpers/utils"
import { dsCssPath, getDSVar, postcssParseFile } from "../../helpers/postcss"
import { normalizeColor } from "../../helpers/culori"

test.beforeAll(async ({ extensionSW }) => {
  // expect storage shortcut to be F2
  const userStorage = await extensionSW.evaluate(() =>
    chrome.storage.local.get(null),
  )
  expect(userStorage.settings.shortcut).toEqual(defaultShortcutF2)
  expect(userStorage).toEqual(initialStorage)
})

test("show storage setting correctly", async ({
  context,
  page,
  extensionSW,
}) => {
  await page.goto("https://google.com")
  // open extension page
  const [extensionPage] = await Promise.all([
    context.waitForEvent("page"),
    page.keyboard.press("F2"),
  ])
  expect(extensionPage).toBeTruthy()
  await extensionPage.waitForLoadState("domcontentloaded")

  // set stuff
  const toggleSettingsBtn = extensionPage.locator("#settingsPopoverBtn")
  const settingsPopover = extensionPage.locator(".settingsContainer .popover")
  let darkmode, largerWidth, shortcutText

  // 1. default settings

  await toggleSettingsBtn.click()
  ;[darkmode, largerWidth, shortcutText] = await settingsPopover.evaluate(
    (node) =>
      Array.from(node.querySelectorAll("button")).map((btn) => btn.textContent),
  )
  expect(darkmode).toBe("false")
  expect(largerWidth).toBe("false")
  expect(shortcutText).toBe("F2")

  // 2. overwrite storage with other values and check

  // overwrite storage
  await extensionSW.evaluate(() =>
    chrome.storage.local.set({
      settings: {
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
  // refresh page
  await Promise.all([
    extensionPage.waitForEvent("load"),
    extensionPage.reload(),
  ])

  // check
  await toggleSettingsBtn.click()
  ;[darkmode, largerWidth, shortcutText] = await settingsPopover.evaluate(
    (node) =>
      Array.from(node.querySelectorAll("button")).map((btn) => btn.textContent),
  )
  expect(darkmode).toBe("true")
  expect(largerWidth).toBe("true")
  expect(shortcutText).toBe("Ctrl + Alt + Meta + Shift + Q")
})

test.describe("update appearance on settings value change", () => {
  test("darkmode", async ({ context, page }) => {
    const postRoot = await postcssParseFile(dsCssPath)
    await page.goto("https://google.com")

    // open extension page
    const [extensionPage] = await Promise.all([
      context.waitForEvent("page"),
      page.keyboard.press("F2"),
    ])
    expect(extensionPage).toBeTruthy()
    await extensionPage.waitForLoadState("domcontentloaded")

    const toggleSettingsBtn = extensionPage.locator("#settingsPopoverBtn")
    await toggleSettingsBtn.click()

    // TODO: assert storage darkmode, set var (maybe previousDarkMode), compare at changes

    // check bg before updating
    const bodyBg = await extensionPage.evaluate(
      () => getComputedStyle(document.body).backgroundColor,
    )
    expect(normalizeColor(bodyBg)).toBe(
      normalizeColor(
        getDSVar({
          postRoot,
          varName: "bg",
          darkmode: initialStorage.settings.darkmode,
        }),
      ),
    )

    // update darkmode
    const darkmodeBtn = extensionPage
      .locator(".settingsContainer .popover button")
      .first()
    await darkmodeBtn.click()

    // check after updating
    const bodyBg = await extensionPage.evaluate(
      () => getComputedStyle(document.body).backgroundColor,
    )
    expect(normalizeColor(bodyBg)).toBe(
      normalizeColor(
        getDSVar({
          postRoot,
          varName: "bg",
          darkmode: initialStorage.settings.darkmode,
        }),
      ),
    )

    // toggle darkmode again

    // check again
  })

  test("larger width", async ({ context, page }) => {})
})

test.describe("update shortcut", () => {
  test("listen keyboard input", async ({ context, page }) => {})

  test("clicking ok button", async ({ context, page }) => {})

  test("clicking reset to f2 button", async ({ context, page }) => {})

  test("clicking cancel button", async ({ context, page }) => {})
})

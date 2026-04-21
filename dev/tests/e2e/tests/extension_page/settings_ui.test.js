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
    // const bodyBg = await extensionPage.evaluate(
    //   () => getComputedStyle(document.body).backgroundColor,
    // )
    // expect(normalizeColor(bodyBg)).toBe(
    //   normalizeColor(
    //     getDSVar({
    //       postRoot,
    //       varName: "bg",
    //       darkmode: initialStorage.settings.darkmode,
    //     }),
    //   ),
    // )
    expect(true).toBe(false)

    // toggle darkmode again

    // check again
  })

  test("larger width", async ({ context, page }) => {
    expect(true).toBe(false)
  })
})

test.describe("update shortcut", () => {
  test("listen keyboard input", async ({ context, page }) => {
    await page.goto("https://google.com")
    // open extension page
    const [extensionPage] = await Promise.all([
      context.waitForEvent("page"),
      page.keyboard.press("F2"),
    ])
    expect(extensionPage).toBeTruthy()
    await extensionPage.waitForLoadState("domcontentloaded")

    // open settings popup
    const toggleSettingsBtn = extensionPage.locator("#settingsPopoverBtn")
    await toggleSettingsBtn.click()
    // click listen shortcut
    const listenShortcutBtn = extensionPage.locator("#shortcutBtn")
    await listenShortcutBtn.click()

    const shortcutTextPTag = extensionPage.locator("#shortcutText")
    let shortcutText

    await extensionPage.keyboard.press("A")
    shortcutText = await shortcutTextPTag.evaluate((node) => node.textContent)
    expect(shortcutText).toBe("A")

    await extensionPage.keyboard.press("Shift+A")
    shortcutText = await shortcutTextPTag.evaluate((node) => node.textContent)
    expect(shortcutText).toBe("Shift + A")

    await extensionPage.keyboard.press("1")
    shortcutText = await shortcutTextPTag.evaluate((node) => node.textContent)
    expect(shortcutText).toBe("1")

    await extensionPage.keyboard.press("Shift+1")
    shortcutText = await shortcutTextPTag.evaluate((node) => node.textContent)
    // should it print like this?
    // TODO: at test its shift + 1, at user its shift + !
    expect(shortcutText).toBe("Shift + 1")

    // should prevent default behavior

    await extensionPage.keyboard.press("Escape")
    shortcutText = await shortcutTextPTag.evaluate((node) => node.textContent)
    expect(shortcutText).toBe("Escape")

    await extensionPage.keyboard.press("F1")
    shortcutText = await shortcutTextPTag.evaluate((node) => node.textContent)
    expect(shortcutText).toBe("F1")

    // filter and not listen

    await extensionPage.keyboard.press("Control")
    shortcutText = await shortcutTextPTag.evaluate((node) => node.textContent)
    expect(shortcutText).toBe("F1")

    await extensionPage.keyboard.press("Alt")
    shortcutText = await shortcutTextPTag.evaluate((node) => node.textContent)
    expect(shortcutText).toBe("F1")

    await extensionPage.keyboard.press("Meta")
    shortcutText = await shortcutTextPTag.evaluate((node) => node.textContent)
    expect(shortcutText).toBe("F1")

    await extensionPage.keyboard.press("Shift")
    shortcutText = await shortcutTextPTag.evaluate((node) => node.textContent)
    expect(shortcutText).toBe("F1")
  })

  test("clicking ok button", async ({ context, page, extensionSW }) => {
    await page.goto("https://google.com")
    // open extension page
    const [extensionPage] = await Promise.all([
      context.waitForEvent("page"),
      page.keyboard.press("F2"),
    ])
    expect(extensionPage).toBeTruthy()
    await extensionPage.waitForLoadState("domcontentloaded")

    // open settings popup
    const toggleSettingsBtn = extensionPage.locator("#settingsPopoverBtn")
    await toggleSettingsBtn.click()
    // click listen shortcut
    const listenShortcutBtn = extensionPage.locator("#shortcutBtn")
    await listenShortcutBtn.click()

    // press key and click ok button
    await extensionPage.keyboard.press("Control+Shift+Q")
    const okBtn = extensionPage.locator("#okBtn")
    await okBtn.click()

    // should be applied at storage
    const storageShortcut = await extensionSW.evaluate(async () => {
      const storage = await chrome.storage.local.get(null)
      return storage.settings.shortcut
    })
    expect(storageShortcut).toEqual({
      ctrlKey: true,
      altKey: false,
      metaKey: false,
      shiftKey: true,
      key: "Q",
    })

    // toast should exist
    const toast = extensionPage.locator("#globalToastGrid .toast").first()
    const toastText = await toast.evaluate((node) => node.textContent)
    console.log("[toastText]", toastText)
    expect(toastText).toContain("Ctrl + Shift + Q")
  })

  test("clicking reset to f2 button", async ({
    context,
    page,
    extensionSW,
  }) => {
    // set shortcut to ctrl+q
    await extensionSW.evaluate(() =>
      chrome.storage.local.set({
        settings: {
          darkmode: false,
          largerWidth: false,
          shortcut: {
            ctrlKey: true,
            altKey: false,
            metaKey: false,
            shiftKey: false,
            key: "Q",
          },
        },
      }),
    )

    await page.goto("https://google.com")
    // open extension page
    const [extensionPage] = await Promise.all([
      context.waitForEvent("page"),
      page.keyboard.press("Control+Q"),
    ])
    expect(extensionPage).toBeTruthy()
    await extensionPage.waitForLoadState("domcontentloaded")

    // open settings popup
    const toggleSettingsBtn = extensionPage.locator("#settingsPopoverBtn")
    await toggleSettingsBtn.click()

    // click listen shortcut
    const listenShortcutBtn = extensionPage.locator("#shortcutBtn")
    await listenShortcutBtn.click()

    const shortcutTextPTag = extensionPage.locator("#shortcutText")
    const resetToF2Btn = extensionPage.locator("#resetToF2")

    // give some other value to listen mode
    await extensionPage.keyboard.press("Control+Alt+Meta+Shift+A")
    let shortcutText = await shortcutTextPTag.evaluate(
      (node) => node.textContent,
    )
    expect(shortcutText).toBe("Ctrl + Alt + Meta + Shift + A")

    // click reset to f2 button
    await resetToF2Btn.click()
    let listenShortcutBtnText = await listenShortcutBtn.evaluate(
      (node) => node.textContent,
    )
    expect(listenShortcutBtnText).toBe("F2")

    // toast should exist
    const toast = extensionPage.locator("#globalToastGrid .toast").first()
    const toastText = await toast.evaluate((node) => node.textContent)
    console.log("[toastText]", toastText)
    expect(toastText).toContain("F2")
  })

  test("clicking cancel button", async ({ context, page }) => {
    expect(true).toBe(false)
  })
})

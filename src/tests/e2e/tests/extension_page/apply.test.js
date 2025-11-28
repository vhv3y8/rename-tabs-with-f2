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

test.describe("basic", () => {
  let extensionPage, secondPage

  // goto pages, open extension page
  test.beforeEach(async ({ context, page }) => {
    await gotoPages({
      context,
      page,
      urls: ["https://github.com", "https://google.com", "chrome://settings/"],
      synchronously: true,
    })

    // open extension page from second tab
    secondPage = context.pages()[1]
    await secondPage.bringToFront()
    ;[extensionPage] = await Promise.all([
      context.waitForEvent("page"),
      secondPage.keyboard.press("F2"),
    ])
    expect(extensionPage).toBeTruthy()
    extensionPage.waitForEvent("domcontentloaded")
    // wait for extension page to query and focus
    await sleep(2000)
  })

  test("press control + enter key", async ({ context, page, extensionSW }) => {
    await extensionPage.keyboard.type("hello world")
    await extensionPage.keyboard.press("Shift+Enter")
    await extensionPage.keyboard.type("bye there")

    // press key
    await Promise.all([
      extensionPage.waitForEvent("close"),
      extensionPage.keyboard.press("Control+Enter").catch(() => {}),
    ])

    // title changed
    const titles = await Promise.all(
      context.pages().map((page) => page.title()),
    )
    expect(titles[0]).toBe("bye there")
    expect(titles[1]).toBe("hello world")

    // focus back to last focus tab
    const focusedTabTitle = await extensionSW.evaluate(() =>
      chrome.tabs
        .query({ currentWindow: true, active: true })
        .then((tabs) => tabs[0].title),
    )
    expect(focusedTabTitle).toBe("hello world")
  })

  test("click 'ctrl + enter' button", async ({
    context,
    page,
    extensionSW,
  }) => {
    await extensionPage.keyboard.type("hello world")
    await extensionPage.keyboard.press("Shift+Enter")
    await extensionPage.keyboard.type("bye there")

    // click button
    const ctrlEnterBtnElem = extensionPage.locator("#ctrlEnterBtn")
    await Promise.all([
      extensionPage.waitForEvent("close"),
      ctrlEnterBtnElem.click(),
    ])

    // title changed
    const titles = await Promise.all(
      context.pages().map((page) => page.title()),
    )
    expect(titles[0]).toBe("bye there")
    expect(titles[1]).toBe("hello world")

    // focus back to last focus tab
    const focusedTabTitle = await extensionSW.evaluate(() =>
      chrome.tabs
        .query({ currentWindow: true, active: true })
        .then((tabs) => tabs[0].title),
    )
    expect(focusedTabTitle).toBe("hello world")
  })
})

test("last focus tab is content script unavailable", async ({
  context,
  page,
  extensionSW,
  extensionId,
}) => {
  // use chrome new tab as last focus tab
  await gotoPages({
    context,
    page,
    urls: ["chrome://newtab/", "https://github.com"],
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
  await extensionPage.waitForEvent("domcontentloaded")
  // wait for extension page to query and focus
  await sleep(1000)

  // do some changes. doesn't matter
  await extensionPage.keyboard.press("Enter")
  await extensionPage.keyboard.type("hello plain tab")

  // apply
  await Promise.all([
    extensionPage.waitForEvent("close"),
    extensionPage.keyboard.press("Control+Enter").catch(() => {}),
  ])

  // should focus back to last focus (content script unavailable) tab anyway
  const focusedTabTitle = await extensionSW.evaluate(() =>
    chrome.tabs
      .query({ currentWindow: true, active: true })
      .then((tabs) => tabs[0].title),
  )
  const newTabPageTitle = await newTabPage.title()
  expect(focusedTabTitle).toBe(newTabPageTitle)
})

test("multiple windows have extension page open", async ({ context, page }) => {
  expect(true).toBe(false)
})

import { test, expect } from "../fixtures/chromium-extension-persistent"
import { gotoPages } from "../helpers/playwright"
import { sleep } from "../helpers/utils"
import { defaultShortcutF2 } from "../../../lib/chrome/storage"

test.beforeAll(async ({ extensionSW }) => {
  // expect storage shortcut to be F2
  const userStorage = await extensionSW.evaluate(() =>
    chrome.storage.local.get(null),
  )
  expect(userStorage.settings.shortcut).toEqual(defaultShortcutF2)
})

test("open with default shortcut F2", async ({
  context,
  page,
  extensionId,
}) => {
  await gotoPages({
    context,
    page,
    urls: ["https://google.com", "https://github.com/"],
  })

  const [extensionPage] = await Promise.all([
    context.waitForEvent("page"),
    page.keyboard.press("F2"),
  ])

  expect(extensionPage).toBeTruthy()
  expect(await extensionPage.title()).toBe("Rename Tabs with F2")
  expect(extensionPage.url()).toBe(
    `chrome-extension://${extensionId}/main/index.html`,
  )
})

test("different shortcut", async ({}) => {
  // set different shortcut with evaluate
})

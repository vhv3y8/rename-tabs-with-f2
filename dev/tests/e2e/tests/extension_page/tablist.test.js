import { test, expect } from "../../fixtures/chromium-extension-persistent"
import { gotoPages } from "../../helpers/playwright"
import { sleep } from "../../helpers/utils"
import { defaultShortcutF2 } from "../../../../lib/chrome/storage"

test.beforeAll(async ({ extensionSW }) => {
  // expect storage shortcut to be F2
  const userStorage = await extensionSW.evaluate(() =>
    chrome.storage.local.get(null),
  )
  expect(userStorage.settings.shortcut).toEqual(defaultShortcutF2)
})

test.describe("basic", () => {
  test("show current window tabs in appearance order", async ({
    context,
    page,
  }) => {
    await gotoPages({
      context,
      page,
      urls: [
        "https://github.com",
        "https://google.com",
        "https://translate.google.com/",
        "https://calendar.google.com/calendar",
      ],
      synchronously: true,
    })

    const pages = context.pages()
    const pageTitles = await Promise.all(pages.map((page) => page.title()))

    const [extensionPage] = await Promise.all([
      context.waitForEvent("page"),
      pages[2].keyboard.press("F2"),
    ])
    expect(extensionPage).toBeTruthy()

    const ulLocator = await extensionPage.locator("main > ul").first()
    const extensionTabItemValues = await ulLocator.evaluate((node) => {
      const tabItemInputs = node.querySelectorAll("li > label > input")
      return Array.from(tabItemInputs).map((input) => input.value)
    })

    expect(extensionTabItemValues).toEqual(pageTitles)
  })

  test.describe("ui focus last focus tab initially", () => {
    test("basic", async ({ context, page }) => {
      await gotoPages({
        context,
        page,
        urls: [
          "https://google.com",
          "https://github.com",
          "https://calendar.google.com/calendar",
        ],
        synchronously: true,
      })

      const pages = context.pages()
      // last focus tab is second tab
      const lastFocusTab = pages[1]

      const lastFocusTabTitle = await lastFocusTab.title()
      expect(lastFocusTabTitle.toLowerCase()).toContain("github")

      // open extension page
      await lastFocusTab.bringToFront()
      const [extensionPage] = await Promise.all([
        context.waitForEvent("page"),
        lastFocusTab.keyboard.press("F2"),
      ])
      expect(extensionPage).toBeTruthy()

      await extensionPage.waitForLoadState("domcontentloaded")
      // wait for extension page to query and focus
      await sleep(2000)

      const focusedItemInputValue = await extensionPage.evaluate(
        () => document.activeElement.value,
      )
      expect(focusedItemInputValue).toBe(lastFocusTabTitle)
    })

    test("last focus tab is NOT content script available", async ({
      context,
      page,
      extensionSW,
      extensionId,
    }) => {
      await page.goto("chrome://newtab/")

      // open extension page using test bridge
      let bridgePage = await context.newPage()
      await bridgePage.goto(
        `chrome-extension://${extensionId}/test-bridge.html`,
      )
      // set new tab page as last focus tab
      await page.bringToFront()

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
      const focusedItemInputValue = await extensionPage.evaluate(
        () => document.activeElement.value,
      )

      // TODO: ????
      expect(focusedItemInputValue).toBe("New Tab")
      // TODO: should focus first available next tab item.
      // if no tab is available, it should not focus anything.
      expect(true).toBe(false)
    })
  })
})

test.describe("movement", () => {
  let pages, titles, extensionPage, focusedItemInputValue, focusedItemSelection

  // goto pages, open extension page, check initial title
  test.beforeEach(async ({ context, page }) => {
    await gotoPages({
      context,
      page,
      urls: [
        "https://github.com",
        "https://calendar.google.com/calendar",
        "https://google.com",
        "https://translate.google.com/",
      ],
      synchronously: true,
    })

    pages = context.pages()
    titles = await Promise.all(pages.map((page) => page.title()))
    const firstPage = pages[0]

    // open extension page
    await firstPage.bringToFront()
    ;[extensionPage] = await Promise.all([
      context.waitForEvent("page"),
      firstPage.keyboard.press("F2"),
    ])
    expect(extensionPage).toBeTruthy()
    extensionPage.waitForEvent("domcontentloaded")
    // wait for extension page to query and focus
    await sleep(2000)

    // check initial
    ;({ focusedItemInputValue, focusedItemSelection } =
      await extensionPage.evaluate(() => {
        const focused = document.activeElement
        return {
          focusedItemInputValue: focused.value,
          focusedItemSelection: focused.value.slice(
            focused.selectionStart,
            focused.selectionEnd,
          ),
        }
      }))
    expect(focusedItemInputValue).toEqual(titles[0])
    expect(focusedItemSelection).toEqual(focusedItemInputValue)
  })

  test("move to next, previous", async ({ context, page }) => {
    // next
    await extensionPage.keyboard.press("Enter")
    ;({ focusedItemInputValue, focusedItemSelection } =
      await extensionPage.evaluate(() => {
        const focused = document.activeElement
        return {
          focusedItemInputValue: focused.value,
          focusedItemSelection: focused.value.slice(
            focused.selectionStart,
            focused.selectionEnd,
          ),
        }
      }))
    expect(focusedItemInputValue).toEqual(titles[1])
    expect(focusedItemSelection).toEqual(focusedItemInputValue)

    await extensionPage.keyboard.press("Tab")
    ;({ focusedItemInputValue, focusedItemSelection } =
      await extensionPage.evaluate(() => {
        const focused = document.activeElement
        return {
          focusedItemInputValue: focused.value,
          focusedItemSelection: focused.value.slice(
            focused.selectionStart,
            focused.selectionEnd,
          ),
        }
      }))
    expect(focusedItemInputValue).toEqual(titles[2])
    expect(focusedItemSelection).toEqual(focusedItemInputValue)

    // previous
    await extensionPage.keyboard.press("Shift+Enter")
    ;({ focusedItemInputValue, focusedItemSelection } =
      await extensionPage.evaluate(() => {
        const focused = document.activeElement
        return {
          focusedItemInputValue: focused.value,
          focusedItemSelection: focused.value.slice(
            focused.selectionStart,
            focused.selectionEnd,
          ),
        }
      }))
    expect(focusedItemInputValue).toEqual(titles[1])
    expect(focusedItemSelection).toEqual(focusedItemInputValue)

    await extensionPage.keyboard.press("Shift+Tab")
    ;({ focusedItemInputValue, focusedItemSelection } =
      await extensionPage.evaluate(() => {
        const focused = document.activeElement
        return {
          focusedItemInputValue: focused.value,
          focusedItemSelection: focused.value.slice(
            focused.selectionStart,
            focused.selectionEnd,
          ),
        }
      }))
    expect(focusedItemInputValue).toEqual(titles[0])
    expect(focusedItemSelection).toEqual(focusedItemInputValue)

    // previous at first, next at last
    await extensionPage.keyboard.press("Shift+Enter")
    ;({ focusedItemInputValue, focusedItemSelection } =
      await extensionPage.evaluate(() => {
        const focused = document.activeElement
        return {
          focusedItemInputValue: focused.value,
          focusedItemSelection: focused.value.slice(
            focused.selectionStart,
            focused.selectionEnd,
          ),
        }
      }))
    expect(focusedItemInputValue).toEqual(titles[titles.length - 1])
    expect(focusedItemSelection).toEqual(focusedItemInputValue)

    await extensionPage.keyboard.press("Enter")
    ;({ focusedItemInputValue, focusedItemSelection } =
      await extensionPage.evaluate(() => {
        const focused = document.activeElement
        return {
          focusedItemInputValue: focused.value,
          focusedItemSelection: focused.value.slice(
            focused.selectionStart,
            focused.selectionEnd,
          ),
        }
      }))
    expect(focusedItemInputValue).toEqual(titles[0])
    expect(focusedItemSelection).toEqual(focusedItemInputValue)
  })

  test("move to initial", async ({ context, page }) => {
    // move to some other item
    await extensionPage.keyboard.press("Enter")
    await extensionPage.keyboard.press("Enter")
    focusedItemInputValue = await extensionPage.evaluate(
      () => document.activeElement.value,
    )
    expect(focusedItemInputValue).not.toEqual(titles[0])

    // move to initial
    await extensionPage.keyboard.press("Escape")
    ;({ focusedItemInputValue, focusedItemSelection } =
      await extensionPage.evaluate(() => {
        const focused = document.activeElement
        return {
          focusedItemInputValue: focused.value,
          focusedItemSelection: focused.value.slice(
            focused.selectionStart,
            focused.selectionEnd,
          ),
        }
      }))
    expect(focusedItemInputValue).toEqual(titles[0])
    expect(focusedItemSelection).toEqual(focusedItemInputValue)
  })

  test("click tab item to focus", async ({ context, page }) => {
    const tabItemListLocator = extensionPage.locator("main > ul").first()

    const thirdItem = await tabItemListLocator.locator("> li > label").nth(2)
    await thirdItem.click()
    ;({ focusedItemInputValue, focusedItemSelection } =
      await extensionPage.evaluate(() => {
        const focused = document.activeElement
        return {
          focusedItemInputValue: focused.value,
          focusedItemSelection: focused.value.slice(
            focused.selectionStart,
            focused.selectionEnd,
          ),
        }
      }))
    expect(focusedItemInputValue).toEqual(titles[2])
    expect(focusedItemSelection).toEqual(focusedItemInputValue)

    const secondItem = await tabItemListLocator.locator("> li > label").nth(1)
    await secondItem.click()
    ;({ focusedItemInputValue, focusedItemSelection } =
      await extensionPage.evaluate(() => {
        const focused = document.activeElement
        return {
          focusedItemInputValue: focused.value,
          focusedItemSelection: focused.value.slice(
            focused.selectionStart,
            focused.selectionEnd,
          ),
        }
      }))
    expect(focusedItemInputValue).toEqual(titles[1])
    expect(focusedItemSelection).toEqual(focusedItemInputValue)
  })
})

test.describe("content script unavailable tab items", () => {
  test("not focusable, blur (tooltip on hover?)", async ({ context, page }) => {
    await gotoPages({
      context,
      page,
      urls: [
        "chrome://newtab",
        "https://google.com",
        "https://chromewebstore.google.com/",
        "chrome://settings/",
      ],
      synchronously: true,
    })

    const [extensionPage] = await Promise.all([
      context.waitForEvent("page"),
      context.pages()[1].keyboard.press("F2"),
    ])
    expect(extensionPage).toBeTruthy()
    await extensionPage.waitForEvent("domcontentloaded")
    // wait for extension page to query and focus
    await sleep(2000)

    const ulLocator = extensionPage.locator("main > ul").first()
    const listItem = ulLocator.locator("> li")
    const listItemCount = await listItem.count()
    for (let i = 0; i < listItemCount; i++) {
      // pass second tab
      if (i === 1) continue
      // other tab item li tag should be not focusable, blur
      let { itemOpacity, itemPointerEvents } = await listItem
        .nth(i)
        .evaluate((node) => {
          const style = getComputedStyle(node)
          return {
            itemOpacity: style.opacity,
            itemPointerEvents: style.pointerEvents,
          }
        })
      expect(itemOpacity).toBe("0.3")
      expect(itemPointerEvents).toBe("none")
    }
  })

  test("when initial tab is content script unavailable", async ({}) => {
    expect(1 + 1).toBe(1)
    // TODO
  })

  test("all tabs are content script unavailable", async ({}) => {
    expect(1 + 1).toBe(1)
    // TODO
  })
})

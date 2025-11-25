import { test, expect } from "../fixtures/chromium-extension-persistent"

test("dummy test", async ({ page, extensionId, gotoMainPage }) => {
  console.log("[extensionId]", extensionId)
  // await page.goto(`chrome-extension://${extensionId}/main/index.html`)
  await gotoMainPage()
  await expect(page).toHaveTitle("Rename Tabs with F2")

  const title = await page.title()
  console.log("[page.title]", title)
})

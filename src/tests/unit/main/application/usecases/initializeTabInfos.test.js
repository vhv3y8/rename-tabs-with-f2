import { describe, expect, test, vi } from "vitest"
import {
  initializeLastFocusTabId,
  initializeTabIdxToInfo,
} from "../../../../../main/lib/application/usecases/initializeTabInfos"

import { getLastFocusTabId } from "../../../../../lib/chrome/runtime"
import { getAllCurrentWindowTabsWithoutExtensionPage } from "../../../../../lib/chrome/tabs"
import {
  resetTabIdxToInfo,
  setLastFocusTabIdWritable,
} from "../../../../../main/lib/application/tabInfo.svelte"

vi.mock("../../../../../lib/chrome/runtime", () => ({
  getLastFocusTabId: vi.fn(),
}))
vi.mock("../../../../../lib/chrome/tabs", () => ({
  getAllCurrentWindowTabsWithoutExtensionPage: vi.fn(),
}))
vi.mock("../../../../../main/lib/application/tabInfo.svelte", () => ({
  setLastFocusTabIdWritable: vi.fn(),
  resetTabIdxToInfo: vi.fn(),
}))

test("initialize tab infos", async () => {
  getAllCurrentWindowTabsWithoutExtensionPage.mockImplementationOnce(() => [
    {
      index: 0,
      id: 1332,
      title: "hi",
      favIconUrl: "someurl",
    },
    {
      index: 1,
      id: 24324,
      title: "there",
      favIconUrl: "someurl2",
    },
    {
      index: 2,
      id: 4312,
      title: "bye",
      favIconUrl: "someurl3",
    },
  ])

  await initializeTabIdxToInfo()

  expect(getAllCurrentWindowTabsWithoutExtensionPage).toHaveBeenCalled()
  expect(resetTabIdxToInfo).toHaveBeenCalledWith({
    0: {
      id: 1332,
      title: "hi",
      favIconUrl: "someurl",
      hasChanged: false,
      contentScriptAvailable: true,
    },
    1: {
      id: 24324,
      title: "there",
      favIconUrl: "someurl2",
      hasChanged: false,
      contentScriptAvailable: true,
    },
    2: {
      id: 4312,
      title: "bye",
      favIconUrl: "someurl3",
      hasChanged: false,
      contentScriptAvailable: true,
    },
  })
})

test("initialize last focus tab id", async () => {
  getLastFocusTabId.mockImplementationOnce(() => 12321)

  await initializeLastFocusTabId()

  expect(setLastFocusTabIdWritable).toHaveBeenCalledWith(12321)
})

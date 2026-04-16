import { describe, test, vi, beforeEach, expect, afterEach } from "vitest"
import { checkContentScriptAvailableAndUpdateAllInfo } from "../../../../../main/lib/application/usecases/checkContentScriptAvailable"

import { contentScriptIsAvailable } from "../../../../../lib/chrome/tabs"
import { tabIdxToInfo } from "../../../../../main/lib/application/tabInfo.svelte"

beforeEach(() => {
  vi.resetModules()

  vi.mock("../../../../../lib/chrome/tabs", () => ({
    contentScriptIsAvailable: vi.fn(),
  }))
  vi.mock("../../../../../main/lib/application/tabInfo.svelte")
})

describe("check content script available", () => {
  let tabInfoFile

  beforeEach(async () => {
    vi.clearAllMocks()

    tabInfoFile = {
      tabIdxToInfo: {
        0: {
          id: 1234,
          contentScriptAvailable: true,
        },
        1: {
          id: 2345,
          contentScriptAvailable: true,
        },
        2: {
          id: 3456,
          contentScriptAvailable: true,
        },
        3: {
          id: 4567,
          contentScriptAvailable: true,
        },
      },
    }
    vi.doMock(
      "../../../../../main/lib/application/tabInfo.svelte",
      () => tabInfoFile,
    )
  })

  test("all available", async () => {
    const { checkContentScriptAvailableAndUpdateAllInfo } = await import(
      "../../../../../main/lib/application/usecases/checkContentScriptAvailable"
    )
    contentScriptIsAvailable.mockImplementation(() => true)

    await checkContentScriptAvailableAndUpdateAllInfo()

    expect(contentScriptIsAvailable.mock.calls).toEqual([
      [{ id: 1234 }],
      [{ id: 2345 }],
      [{ id: 3456 }],
      [{ id: 4567 }],
    ])
    expect(
      Object.values(tabInfoFile.tabIdxToInfo).map(
        ({ contentScriptAvailable }) => contentScriptAvailable,
      ),
    ).toEqual([true, true, true, true])
  })

  test("some unavailable", async () => {
    const { checkContentScriptAvailableAndUpdateAllInfo } = await import(
      "../../../../../main/lib/application/usecases/checkContentScriptAvailable"
    )
    contentScriptIsAvailable.mockImplementation(({ id }) => {
      if (id < 3333) return false
      else return true
    })

    await checkContentScriptAvailableAndUpdateAllInfo()

    expect(contentScriptIsAvailable.mock.calls).toEqual([
      [{ id: 1234 }],
      [{ id: 2345 }],
      [{ id: 3456 }],
      [{ id: 4567 }],
    ])
    expect(
      Object.values(tabInfoFile.tabIdxToInfo).map(
        ({ contentScriptAvailable }) => contentScriptAvailable,
      ),
    ).toEqual([false, false, true, true])
  })

  test("all unavailable", async () => {
    const { checkContentScriptAvailableAndUpdateAllInfo } = await import(
      "../../../../../main/lib/application/usecases/checkContentScriptAvailable"
    )
    contentScriptIsAvailable.mockImplementation(() => false)

    await checkContentScriptAvailableAndUpdateAllInfo()

    expect(contentScriptIsAvailable.mock.calls).toEqual([
      [{ id: 1234 }],
      [{ id: 2345 }],
      [{ id: 3456 }],
      [{ id: 4567 }],
    ])
    expect(
      Object.values(tabInfoFile.tabIdxToInfo).map(
        ({ contentScriptAvailable }) => contentScriptAvailable,
      ),
    ).toEqual([false, false, false, false])
  })
})

// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from "vitest"
// import { apply } from "../../../../../main/lib/application/usecases/apply"

// import { tabIdxToInfo } from "../../../../../main/lib/application/tabInfo.svelte"
// import { fireChangeTitleToContentScript } from "../../../../../lib/chrome/tabs"

vi.spyOn(window, "close")

vi.mock("../../../../../main/lib/application/tabInfo.svelte")
vi.mock("../../../../../lib/chrome/tabs", () => ({
  fireChangeTitleToContentScript: vi.fn(),
}))

beforeEach(() => {
  // vi.resetModules()

  console.log("[document: beforeEach]", document)
})

describe("apply", () => {
  it("all changed, all content script available", async () => {
    vi.doMock("../../../../../main/lib/application/tabInfo.svelte", () => ({
      tabIdxToInfo: {
        0: {
          id: 12321,
          title: "hi",
          hasChanged: true,
          contentScriptAvailable: true,
        },
        1: {
          id: 23432,
          title: "there",
          hasChanged: true,
          contentScriptAvailable: true,
        },
        2: {
          id: 34543,
          title: "good",
          hasChanged: true,
          contentScriptAvailable: true,
        },
        3: {
          id: 45654,
          title: "bye",
          hasChanged: true,
          contentScriptAvailable: true,
        },
      },
    }))
    const { apply } = await import(
      "../../../../../main/lib/application/usecases/apply"
    )

    console.log("[document]", document)

    await apply()

    expect(fireChangeTitleToContentScript.mock.calls).toEqual([
      [{ id: 12321, title: "hi" }],
      [{ id: 23432, title: "there" }],
      [{ id: 34543, title: "good" }],
      [{ id: 45654, title: "bye" }],
    ])
    expect(window.close).toHaveBeenCalled()
  })

  it("all changed, some content script unavailable", async () => {
    vi.doMock("../../../../../main/lib/application/tabInfo.svelte", () => ({
      tabIdxToInfo: {
        0: {
          id: 12321,
          title: "hi",
          hasChanged: true,
          contentScriptAvailable: false,
        },
        1: {
          id: 23432,
          title: "there",
          hasChanged: true,
          contentScriptAvailable: false,
        },
        2: {
          id: 34543,
          title: "good",
          hasChanged: true,
          contentScriptAvailable: true,
        },
        3: {
          id: 45654,
          title: "bye",
          hasChanged: true,
          contentScriptAvailable: true,
        },
      },
    }))
    const { apply } = await import(
      "../../../../../main/lib/application/usecases/apply"
    )

    console.log("[document]", document)

    await apply()

    expect(fireChangeTitleToContentScript.mock.calls).toEqual([
      [{ id: 34543, title: "good" }],
      [{ id: 45654, title: "bye" }],
    ])
    expect(window.close).toHaveBeenCalled()
  })

  it("some not changed, all content script unavailable", async () => {
    vi.doMock("../../../../../main/lib/application/tabInfo.svelte", () => ({
      tabIdxToInfo: {
        0: {
          id: 12321,
          title: "hi",
          hasChanged: false,
          contentScriptAvailable: true,
        },
        1: {
          id: 23432,
          title: "there",
          hasChanged: false,
          contentScriptAvailable: true,
        },
        2: {
          id: 34543,
          title: "good",
          hasChanged: true,
          contentScriptAvailable: true,
        },
        3: {
          id: 45654,
          title: "bye",
          hasChanged: true,
          contentScriptAvailable: true,
        },
      },
    }))
    const { apply } = await import(
      "../../../../../main/lib/application/usecases/apply"
    )

    console.log("[document]", document)

    await apply()

    console.log(
      "[fireChangeTitleToContentScript.mock.calls]",
      fireChangeTitleToContentScript.mock.calls,
    )

    expect(fireChangeTitleToContentScript.mock.calls).toEqual([
      [{ id: 34543, title: "good" }],
      [{ id: 45654, title: "bye" }],
    ])
    expect(window.close).toHaveBeenCalled()
  })
})

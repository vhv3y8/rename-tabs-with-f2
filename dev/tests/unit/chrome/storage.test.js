import { describe, expect, it, vi } from "vitest"
import { initialStorage, migrateStorage } from "../../../lib/chrome/storage"

vi.stubGlobal("chrome", {
  storage: {
    local: {
      get: vi.fn(),
      set: vi.fn(),
    },
  },
})

describe("storage migration", () => {
  it("existing ones doesn't get overrided, new property gets added", async () => {
    chrome.storage.local.get.mockImplementationOnce(() => ({
      settings: {
        darkmode: false,
        largerWidth: false,
        shortcut: {
          ctrlKey: false,
          altKey: false,
          metaKey: false,
          shiftKey: false,
          key: "F2",
        },
      },
    }))

    let updatedDefaults = {
      settings: {
        SomeNewBoolean: true,
        SomeNewString: "hi",
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
    }
    await migrateStorage(updatedDefaults)

    expect(chrome.storage.local.set).toHaveBeenCalledWith({
      settings: {
        SomeNewBoolean: true,
        SomeNewString: "hi",
        darkmode: false,
        largerWidth: false,
        shortcut: {
          ctrlKey: false,
          altKey: false,
          metaKey: false,
          shiftKey: false,
          key: "F2",
        },
      },
    })
  })

  it("diverse depth new property", async () => {
    chrome.storage.local.get.mockImplementationOnce(() => ({
      settings: {
        darkmode: true,
        largerWidth: false,
        shortcut: {
          ctrlKey: false,
          altKey: false,
          metaKey: false,
          shiftKey: true,
          key: "A",
        },
      },
    }))

    const updatedDefaults = {
      SomeNull: null,
      settings: {
        SomeNewBoolean: true,
        SomeNewString: "hi",
        darkmode: true,
        largerWidth: true,
        shortcut: {
          ctrlKey: true,
          altKey: true,
          metaKey: true,
          shiftKey: true,
          key: "Q",
          SomeNewKey: true,
        },
      },
    }
    await migrateStorage(updatedDefaults)

    expect(chrome.storage.local.set).toHaveBeenCalledWith({
      SomeNull: null,
      settings: {
        SomeNewBoolean: true,
        SomeNewString: "hi",
        darkmode: true,
        largerWidth: false,
        shortcut: {
          ctrlKey: false,
          altKey: false,
          metaKey: false,
          shiftKey: true,
          key: "A",
          SomeNewKey: true,
        },
      },
    })
  })
})

// describe(`"settings"`, () => {})

import { describe, expect, it } from "vitest"

import {
  MigrationAggregator,
  SchemaEditor,
  type TargetVersionMigrationRecord,
} from "./migration"

describe("SchemaEditor.map", () => {
  it("returns the editor instance so calls can be chained", () => {
    const editor = new SchemaEditor({
      settings: {
        shortcuts: {
          primary: "ctrl-k",
        },
      },
    })
    const chainedEditor = editor
      .create("settings.profile.display.theme.name", "midnight")
      .updateValue("settings.shortcuts.primary", (value) => `${value}-updated`)
      .map("settings.shortcuts.primary", "settings.hotkey.primary")
    expect(chainedEditor).toBe(editor)
    expect(editor.data).toEqual({
      settings: {
        shortcuts: {},
        profile: {
          display: {
            theme: {
              name: "midnight",
            },
          },
        },
        hotkey: {
          primary: "ctrl-k-updated",
        },
      },
    })
  })
  it("skips when the source path does not exist", () => {
    const editor = new SchemaEditor({})
    editor.map("shortcut", "hotkey")
    expect(editor.data).toEqual({})
  })
  it("moves nested values and keeps the mapped shape intact", () => {
    const editor = new SchemaEditor({
      settings: {
        shortcuts: {
          primary: "ctrl-k",
          legacy: "keep",
        },
      },
    })
    editor.map("settings.shortcuts.primary", "settings.hotkey.primary")
    expect(editor.data).toEqual({
      settings: {
        shortcuts: {
          legacy: "keep",
        },
        hotkey: {
          primary: "ctrl-k",
        },
      },
    })
  })
  it("creates deep paths and ignores missing updates", () => {
    const editor = new SchemaEditor({
      settings: {
        shortcuts: {
          primary: "ctrl-k",
        },
      },
    })
    editor.create("settings.profile.display.theme.name", "midnight")
    editor.updateValue(
      "settings.shortcuts.primary",
      (value) => `${value}-updated`,
    )
    editor.updateValue(
      "settings.shortcuts.missing.value",
      (value) => `${value}-ignored`,
    )
    expect(editor.data).toEqual({
      settings: {
        shortcuts: {
          primary: "ctrl-k-updated",
        },
        profile: {
          display: {
            theme: {
              name: "midnight",
            },
          },
        },
      },
    })
  })
})

describe("MigrationAggregator.migrate", () => {
  it("runs all later migrations when targetVersion is omitted", () => {
    const runOrder: string[] = []
    const migrations: TargetVersionMigrationRecord = {
      "1.1.0": (editor) => {
        runOrder.push("1.1.0")
        editor.create("settings.shortcuts.primary", "ctrl-k")
      },
      "1.2.0": (editor) => {
        runOrder.push("1.2.0")
        editor.updateValue(
          "settings.shortcuts.primary",
          (value) => `${value}-updated`,
        )
      },
      "2.0.0": (editor) => {
        runOrder.push("2.0.0")
        editor.map("settings.shortcuts.primary", "settings.hotkey.primary")
      },
    }
    const result = new MigrationAggregator(migrations).migrate(
      { settings: {} },
      "1.0.0",
    )
    expect(runOrder).toEqual(["1.1.0", "1.2.0", "2.0.0"])
    expect(result).toEqual({
      settings: {
        shortcuts: {},
        hotkey: {
          primary: "ctrl-k-updated",
        },
      },
    })
  })
  it("starts from the middle version and only runs later migrations", () => {
    const runOrder: string[] = []
    const migrations: TargetVersionMigrationRecord = {
      "1.1.0": (editor) => {
        runOrder.push("1.1.0")
        editor.create("settings.shortcuts.primary", "ctrl-k")
      },
      "1.2.0": (editor) => {
        runOrder.push("1.2.0")
        editor.updateValue(
          "settings.shortcuts.primary",
          (value) => `${value}-updated`,
        )
      },
      "2.0.0": (editor) => {
        runOrder.push("2.0.0")
        editor.map("settings.shortcuts.primary", "settings.hotkey.primary")
      },
    }
    const result = new MigrationAggregator(migrations).migrate(
      {
        settings: {
          shortcuts: {
            primary: "ctrl-k",
          },
        },
      },
      "1.1.0",
    )
    expect(runOrder).toEqual(["1.2.0", "2.0.0"])
    expect(result).toEqual({
      settings: {
        shortcuts: {},
        hotkey: {
          primary: "ctrl-k-updated",
        },
      },
    })
  })
  it("runs a deep migration chain in semver order and includes the target version", () => {
    const runOrder: string[] = []
    const migrations: TargetVersionMigrationRecord = {
      "1.1.0": (editor) => {
        runOrder.push("1.1.0")
        editor.create("settings.shortcuts.primary", "ctrl-k")
        editor.create("settings.shortcuts.secondary", "ctrl-shift-k")
        editor.create("settings.shortcuts.legacy", "keep")
        editor.create("settings.metadata.flags.enabled", true)
      },
      "1.2.0": (editor) => {
        runOrder.push("1.2.0")
        editor.updateValue(
          "settings.shortcuts.primary",
          (value) => `${value}-updated`,
        )
        editor.updateValue(
          "settings.shortcuts.missing.value",
          (value) => `${value}-ignored`,
        )
        editor.create("settings.appearance.theme.palette", "midnight")
        editor.create("profile.details.locale", "ko-KR")
      },
      "2.0.0": (editor) => {
        runOrder.push("2.0.0")
        editor.map("settings.shortcuts.primary", "settings.hotkey.primary")
        editor.map("settings.shortcuts.secondary", "settings.hotkey.secondary")
        editor.updateValue(
          "settings.appearance.theme.palette",
          (value) => `${value}-dark`,
        )
        editor.create("profile.details.touchedByMigration", true)
      },
    }
    const result = new MigrationAggregator(migrations).migrate(
      {
        settings: {
          appearance: {
            theme: {
              palette: "light",
            },
          },
        },
        profile: {
          name: "before",
        },
        untouched: {
          nested: {
            leaf: 1,
          },
        },
      },
      "1.0.0",
      "2.0.0",
    )
    expect(runOrder).toEqual(["1.1.0", "1.2.0", "2.0.0"])
    expect(result).toEqual({
      settings: {
        shortcuts: {
          legacy: "keep",
        },
        appearance: {
          theme: {
            palette: "midnight-dark",
          },
        },
        metadata: {
          flags: {
            enabled: true,
          },
        },
        hotkey: {
          primary: "ctrl-k-updated",
          secondary: "ctrl-shift-k",
        },
      },
      profile: {
        name: "before",
        details: {
          locale: "ko-KR",
          touchedByMigration: true,
        },
      },
      untouched: {
        nested: {
          leaf: 1,
        },
      },
    })
  })

  describe("error cases", () => {
    it("fails fast when a migration key is not semver", () => {
      const migrations: TargetVersionMigrationRecord = {
        "1.1.0": (editor) => editor.map("shortcut", "hotkey"),
        invalid: (editor) => editor.map("shortcut", "hotkey"),
      }
      expect(() =>
        new MigrationAggregator(migrations).migrate(
          { shortcut: "ctrl-k" },
          "1.0.0",
        ),
      ).toThrowError(/Invalid migration version\(s\): invalid/)
    })
    it("fails fast when the input versions are not semver", () => {
      const migrations: TargetVersionMigrationRecord = {
        "1.1.0": (editor) => editor.map("shortcut", "hotkey"),
      }
      expect(() =>
        new MigrationAggregator(migrations).migrate(
          { shortcut: "ctrl-k" },
          "not-a-version",
        ),
      ).toThrowError(/Invalid starting version: not-a-version/)
      expect(() =>
        new MigrationAggregator(migrations).migrate(
          { shortcut: "ctrl-k" },
          "1.0.0",
          "not-a-version",
        ),
      ).toThrowError(/Invalid target version: not-a-version/)
    })
  })
})

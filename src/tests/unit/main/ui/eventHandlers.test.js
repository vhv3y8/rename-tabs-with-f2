import { beforeEach, describe, expect, it, vi } from "vitest"
import {
  createNormalKeydownHandler,
  createListenShortcutKeydownHandler,
  createShortcut,
  removeAllKeydownClass,
} from "../../../../main/lib/ui/eventHandlers"
import { preventDefault } from "svelte/legacy"

describe("keydown factories", () => {
  describe("normal keydown factory", () => {
    let elements,
      focusPreviousElement,
      focusNextElement,
      focusInitialElement,
      closeSettingsIfItsVisible,
      handler

    beforeEach(() => {
      elements = {
        tabKeyBtn: null,
        enterKeyBtn: null,
        shiftTabKeyBtn: null,
        shiftEnterKeyBtn: null,
        escKeyBtn: null,
        ctrlEnterBtn: null,
      }
      focusPreviousElement = vi.fn()
      focusNextElement = vi.fn()
      focusInitialElement = vi.fn()
      closeSettingsIfItsVisible = vi.fn()

      handler = createNormalKeydownHandler({
        elements,
        focusPreviousElement,
        focusNextElement,
        focusInitialElement,
        closeSettingsIfItsVisible,
      })
    })

    it("next", () => {
      handler(
        new KeyboardEvent("keydown", {
          key: "Tab",
          ctrlKey: false,
          altKey: false,
          metaKey: false,
          shiftKey: false,
        }),
      )

      expect(focusNextElement).toHaveBeenCalled()
      expect(focusPreviousElement).not.toHaveBeenCalled()
      expect(focusInitialElement).not.toHaveBeenCalled()
      expect(closeSettingsIfItsVisible).not.toHaveBeenCalled()

      focusNextElement.mockClear()

      handler(
        new KeyboardEvent("keydown", {
          key: "Enter",
          ctrlKey: false,
          altKey: false,
          metaKey: false,
          shiftKey: false,
        }),
      )

      expect(focusNextElement).toHaveBeenCalled()
      expect(focusPreviousElement).not.toHaveBeenCalled()
      expect(focusInitialElement).not.toHaveBeenCalled()
      expect(closeSettingsIfItsVisible).not.toHaveBeenCalled()
    })

    it("previous", () => {
      handler(
        new KeyboardEvent("keydown", {
          key: "Tab",
          ctrlKey: false,
          altKey: false,
          metaKey: false,
          shiftKey: true,
        }),
      )

      expect(focusPreviousElement).toHaveBeenCalled()
      expect(focusNextElement).not.toHaveBeenCalled()
      expect(focusInitialElement).not.toHaveBeenCalled()
      expect(closeSettingsIfItsVisible).not.toHaveBeenCalled()

      focusNextElement.mockClear()

      handler(
        new KeyboardEvent("keydown", {
          key: "Enter",
          ctrlKey: false,
          altKey: false,
          metaKey: false,
          shiftKey: true,
        }),
      )

      expect(focusPreviousElement).toHaveBeenCalled()
      expect(focusNextElement).not.toHaveBeenCalled()
      expect(focusInitialElement).not.toHaveBeenCalled()
      expect(closeSettingsIfItsVisible).not.toHaveBeenCalled()
    })

    it("initial", () => {
      handler(
        new KeyboardEvent("keydown", {
          key: "Escape",
          ctrlKey: false,
          altKey: false,
          metaKey: false,
          shiftKey: false,
        }),
      )

      expect(closeSettingsIfItsVisible).toHaveBeenCalled()
      expect(focusInitialElement).toHaveBeenCalled()
      expect(focusPreviousElement).not.toHaveBeenCalled()
      expect(focusNextElement).not.toHaveBeenCalled()
    })
  })

  describe("shortcut listen keydown factory", () => {
    it("create shortcut function (private)", () => {
      expect(
        createShortcut(
          new KeyboardEvent("keydown", {
            key: "Tab",
            ctrlKey: false,
            altKey: false,
            metaKey: false,
            shiftKey: false,
          }),
        ),
      ).toEqual({
        key: "Tab",
        ctrlKey: false,
        altKey: false,
        metaKey: false,
        shiftKey: false,
      })
      expect(
        createShortcut(
          new KeyboardEvent("keydown", {
            key: "Tab",
            ctrlKey: false,
            altKey: false,
            metaKey: false,
            shiftKey: true,
          }),
        ),
      ).toEqual({
        key: "Tab",
        ctrlKey: false,
        altKey: false,
        metaKey: false,
        shiftKey: true,
      })
      expect(
        createShortcut(
          new KeyboardEvent("keydown", {
            key: "Enter",
            ctrlKey: false,
            altKey: false,
            metaKey: false,
            shiftKey: false,
          }),
        ),
      ).toEqual({
        key: "Enter",
        ctrlKey: false,
        altKey: false,
        metaKey: false,
        shiftKey: false,
      })
      expect(
        createShortcut(
          new KeyboardEvent("keydown", {
            key: "Enter",
            ctrlKey: false,
            altKey: false,
            metaKey: false,
            shiftKey: true,
          }),
        ),
      ).toEqual({
        key: "Enter",
        ctrlKey: false,
        altKey: false,
        metaKey: false,
        shiftKey: true,
      })
      expect(
        createShortcut(
          new KeyboardEvent("keydown", {
            key: "Escape",
            ctrlKey: false,
            altKey: false,
            metaKey: false,
            shiftKey: false,
          }),
        ),
      ).toEqual({
        key: "Escape",
        ctrlKey: false,
        altKey: false,
        metaKey: false,
        shiftKey: false,
      })
    })

    it("keydown handler: calls update function with created shortcut object", () => {
      const updateShortcutState = vi.fn()
      const handler = createListenShortcutKeydownHandler({
        updateShortcutState,
      })

      handler(
        new KeyboardEvent("keydown", {
          key: "Tab",
          ctrlKey: false,
          altKey: false,
          metaKey: false,
          shiftKey: true,
        }),
      )

      expect(updateShortcutState).toHaveBeenCalledWith({
        key: "Tab",
        ctrlKey: false,
        altKey: false,
        metaKey: false,
        shiftKey: true,
      })
    })
  })
})

// describe("keyup", () => {
//   // removeAllKeydownClass
// })

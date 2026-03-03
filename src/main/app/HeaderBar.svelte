<script>
import Key from "../components/common/Key.svelte"
import { keydowns } from "../lib/ui/states/keys.svelte"
import { focusTabItem } from "../lib/ui/states/tabs/tabElems.svelte"
</script>

<!-- Header Bar -->
<header>
  <span
    >{chrome.i18n.getMessage("header_focus_initial")} :
    <!-- bind:this={elements.escKeyBtn} -->
    <!-- onclick={focusInitialFocusTabItem} -->
    <Key
      cssPressable={false}
      padding={"0.3em 0.5em"}
      keydown={keydowns.esc}
      onclick={() => {
        focusTabItem({ initial: true })
      }}
      onmousedown={() => {
        // elements.escKeyBtn.classList.add("keydown")
        keydowns.esc = true
      }}
      onmouseup={() => {
        // elements.escKeyBtn.classList.remove("keydown")
        keydowns.esc = false
      }}>ESC</Key
    >
  </span>
  <span
    >{chrome.i18n.getMessage("header_next")} :
    <!-- bind:this={elements.tabKeyBtn} -->
    <Key
      cssPressable={false}
      padding={"0.3em 0.5em"}
      keydown={keydowns.tab}
      onclick={() => {
        // focusInputElement({ focusNext: true })
        focusTabItem({ next: true })
      }}
      onmousedown={() => {
        keydowns.tab = true
        // elements.tabKeyBtn.classList.add("keydown")
      }}
      onmouseup={() => {
        keydowns.tab = false
        // elements.tabKeyBtn.classList.remove("keydown")
      }}>Tab</Key
    >
    /
    <!-- bind:this={elements.enterKeyBtn} -->
    <Key
      cssPressable={false}
      padding={"0.3em 0.5em"}
      keydown={keydowns.enter}
      onclick={() => {
        // focusInputElement({ focusNext: true })
        focusTabItem({ next: true })
      }}
      onmousedown={() => {
        keydowns.enter = true
        // elements.enterKeyBtn.classList.add("keydown")
      }}
      onmouseup={() => {
        keydowns.enter = false
        // elements.enterKeyBtn.classList.remove("keydown")
      }}>Enter</Key
    ></span
  >
  <span>
    <span>{chrome.i18n.getMessage("header_previous")} : </span>
    <!-- bind:this={elements.shiftTabKeyBtn} -->
    <Key
      cssPressable={false}
      padding={"0.3em 0.5em"}
      keydown={keydowns.shiftTab}
      onclick={() => {
        // focusInputElement({ focusNext: false })
        focusTabItem({ next: false })
      }}
      onmousedown={() => {
        // elements.shiftTabKeyBtn.classList.add("keydown")
        keydowns.shiftTab = true
      }}
      onmouseup={() => {
        // elements.shiftTabKeyBtn.classList.remove("keydown")
        keydowns.shiftTab = false
      }}>Shift + Tab</Key
    >
    /
    <!-- bind:this={elements.shiftEnterKeyBtn} -->
    <Key
      cssPressable={false}
      padding={"0.3em 0.5em"}
      keydown={keydowns.shiftEnter}
      onclick={() => {
        // focusInputElement({ focusNext: false })
        focusTabItem({ next: false })
      }}
      onmousedown={() => {
        // elements.shiftEnterKeyBtn.classList.add("keydown")
        keydowns.shiftEnter = true
      }}
      onmouseup={() => {
        // elements.shiftEnterKeyBtn.classList.remove("keydown")
        keydowns.shiftEnter = true
      }}>Shift + Enter</Key
    >
  </span>
</header>

<!-- Style -->

<style>
/* Header */

header {
  flex: 0 0 auto;

  width: 100%;
  box-sizing: border-box;
  /* margin-bottom: 2rem; */
  border-bottom: 2px solid var(--primary-8);
  padding-bottom: 1.25rem;

  font-family: "Open Sans";
  font-size: 20px;

  display: flex;
  flex-flow: row wrap;
  justify-content: flex-end;
  column-gap: 1em;
  row-gap: 0.7em;
}

:global(header button) {
  font-size: 18px;
  padding: 0.3em 0.5em;
}
</style>

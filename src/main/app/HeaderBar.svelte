<script>
import Key from "../components/common/Key.svelte"
import { keydowns } from "../lib/ui/states/keys.svelte"
import { focusTabItem } from "../lib/ui/states/tabs/tabItems.svelte"
</script>

<header>
  <span
    >{chrome.i18n.getMessage("header_focus_initial")} :
    <Key
      cssPressable={false}
      padding={"0.3em 0.5em"}
      keydown={keydowns.esc}
      onclick={() => {
        focusTabItem({ initial: true })
      }}
      onmousedown={() => {
        keydowns.esc = true
      }}
      onmouseup={() => {
        keydowns.esc = false
      }}>ESC</Key
    >
  </span>
  <span
    >{chrome.i18n.getMessage("header_next")} :
    <Key
      cssPressable={false}
      padding={"0.3em 0.5em"}
      keydown={keydowns.tab}
      mousedownRepeat={true}
      onclick={() => {
        focusTabItem({ next: true })
      }}
      onmousedown={() => {
        keydowns.tab = true
      }}
      onmouseup={() => {
        keydowns.tab = false
      }}>Tab</Key
    >
    /
    <Key
      cssPressable={false}
      padding={"0.3em 0.5em"}
      keydown={keydowns.enter}
      mousedownRepeat={true}
      onclick={() => {
        focusTabItem({ next: true })
      }}
      onmousedown={() => {
        keydowns.enter = true
      }}
      onmouseup={() => {
        keydowns.enter = false
      }}>Enter</Key
    ></span
  >
  <span>
    <span>{chrome.i18n.getMessage("header_previous")} : </span>
    <Key
      cssPressable={false}
      padding={"0.3em 0.5em"}
      keydown={keydowns.shiftTab}
      mousedownRepeat={true}
      onclick={() => {
        focusTabItem({ next: false })
      }}
      onmousedown={() => {
        keydowns.shiftTab = true
      }}
      onmouseup={() => {
        keydowns.shiftTab = false
      }}>Shift + Tab</Key
    >
    /
    <Key
      cssPressable={false}
      padding={"0.3em 0.5em"}
      keydown={keydowns.shiftEnter}
      mousedownRepeat={true}
      onclick={() => {
        focusTabItem({ next: false })
      }}
      onmousedown={() => {
        keydowns.shiftEnter = true
      }}
      onmouseup={() => {
        keydowns.shiftEnter = false
      }}>Shift + Enter</Key
    >
  </span>
</header>

<!-- Style -->

<style>
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

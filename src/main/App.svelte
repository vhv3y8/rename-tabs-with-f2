<script>
  import TabItem from "./components/TabItem.svelte"
  import { activeTabId, tabIdToInfo } from "./lib/state.svelte"
  import { onMount } from "svelte"
  import { sendTitleChangeMessages } from "./lib/tabs"

  let elements = $state({
    ulElem: null,
    initialFocusTabItem: null,

    ctrlEnterBtn: null,
    tabKeyBtn: null,
    shiftTabKeyBtn: null,
    enterKeyBtn: null,
    shiftEnterKeyBtn: null,
    escKeyBtn: null,
  })
  let keydownElem = $state(null)

  let focusableInputElements = $state(null)
  let currentFocusInputIdx = $state(null)
  let initialFocusInputIdx = $state(null)

  onMount(() => {
    console.log("onMount")

    /* Set focusableInputElements */
    focusableInputElements = Array.from(
      elements.ulElem.querySelectorAll("input"),
    )
    console.log("focusableInputElements", focusableInputElements)

    /* Set initial focus elem */
    elements.initialFocusTabItem = elements.ulElem.querySelector(
      `input#tab-${activeTabId}`,
    )
    elements.initialFocusTabItem.click()
    elements.initialFocusTabItem.scrollIntoView({ block: "center" })

    /* Set initial indexes */
    initialFocusInputIdx = focusableInputElements.indexOf(
      elements.initialFocusTabItem,
    )
    currentFocusInputIdx = initialFocusInputIdx
  })

  /* Functions */

  function apply() {
    // to trigger change event for focused input element
    focusNextElement()
    focusPreviousElement()

    sendTitleChangeMessages(tabIdToInfo).then(() => {
      // close window after focusing tab
      chrome.runtime.sendMessage("FOCUS").then(() => {
        window.close()
      })
    })
  }

  function focusNextElement() {
    const nextFocusInputIdx =
      currentFocusInputIdx === focusableInputElements.length - 1
        ? 0
        : currentFocusInputIdx + 1
    focusableInputElements[nextFocusInputIdx].click()
    focusableInputElements[nextFocusInputIdx].scrollIntoView({
      block: "center",
    })
    currentFocusInputIdx = nextFocusInputIdx
  }

  function focusPreviousElement() {
    const nextFocusInputIdx =
      currentFocusInputIdx === 0
        ? focusableInputElements.length - 1
        : currentFocusInputIdx - 1
    focusableInputElements[nextFocusInputIdx].click()
    focusableInputElements[nextFocusInputIdx].scrollIntoView({
      block: "center",
    })
    currentFocusInputIdx = nextFocusInputIdx
  }
</script>

<!-- HTML -->

<svelte:document
  onkeydown={(e) => {
    /* Set keydownElem based on e.key */
    switch (e.key) {
      case "Tab": {
        e.preventDefault()
        if (e.shiftKey) {
          keydownElem = elements.shiftTabKeyBtn
          focusPreviousElement()
        } else {
          keydownElem = elements.tabKeyBtn
          focusNextElement()
        }
        break
      }
      case "Enter": {
        e.preventDefault()
        if (e.ctrlKey) {
          apply()
        } else if (e.shiftKey) {
          keydownElem = elements.shiftEnterKeyBtn
          focusPreviousElement()
        } else {
          keydownElem = elements.enterKeyBtn
          focusNextElement()
        }
        break
      }
      case "Escape": {
        e.preventDefault()
        keydownElem = elements.escKeyBtn
        elements.initialFocusTabItem.click()
        currentFocusInputIdx = initialFocusInputIdx
        break
      }
      default: {
        if (e.ctrlKey) {
          keydownElem = elements.ctrlEnterBtn
        } else {
          keydownElem = null
        }
      }
    }

    keydownElem && keydownElem.classList.add("keydown")
  }}
  onkeyup={(e) => {
    document.querySelectorAll("button.keydown").forEach((elem) => {
      elem.classList.remove("keydown")
    })
  }}
/>

<main>
  <header>
    <span
      >{chrome.i18n.getMessage("header_focus_initial")} :
      <button bind:this={elements.escKeyBtn} class="key">ESC</button>
    </span>
    <span
      >{chrome.i18n.getMessage("header_next")} :
      <button bind:this={elements.tabKeyBtn} class="key">Tab</button>
      /
      <button bind:this={elements.enterKeyBtn} class="key">Enter</button></span
    >
    <span>
      <span>{chrome.i18n.getMessage("header_previous")} : </span>
      <button bind:this={elements.shiftTabKeyBtn} class="key"
        >Shift + Tab</button
      >
      /
      <button bind:this={elements.shiftEnterKeyBtn} class="key"
        >Shift + Enter</button
      >
    </span>
  </header>
  <ul bind:this={elements.ulElem}>
    {#each Object.values(tabIdToInfo) as tabInfo, idx}
      <TabItem
        {tabInfo}
        setCurrentFocusInputIdx={() => {
          currentFocusInputIdx = idx
        }}
      />
    {/each}
  </ul>
  <footer>
    <span>{chrome.i18n.getMessage("footer_save_and_close")} :</span>
    <button
      id="ctrlEnterBtn"
      class="key pressable"
      bind:this={elements.ctrlEnterBtn}
      onclick={apply}>Ctrl + Enter</button
    >
  </footer>
</main>

<!-- Style -->

<style>
  main {
    flex: 1 0 auto;

    display: flex;
    flex-flow: column nowrap;

    width: min(100%, 650px);
  }

  ul {
    flex: 1 1 0px;
    overflow-y: auto;

    padding: 0;
    width: 100%;

    padding-right: 1em;
    box-sizing: border-box;
  }

  ul::-webkit-scrollbar {
    width: 1rem;
  }
  ul::-webkit-scrollbar-thumb {
    background-color: white;
    border: 3px solid black;
  }

  header {
    flex: 0 0 auto;

    width: 100%;
    box-sizing: border-box;
    margin-bottom: 2rem;
    border-bottom: 2px solid #333;
    padding-bottom: 1.25rem;

    font-family: "Open Sans";
    font-size: 20px;

    display: flex;
    flex-flow: row wrap;
    justify-content: flex-end;
    column-gap: 1em;
    row-gap: 0.7em;
  }

  header button {
    font-size: 18px;
    padding: 0.3em 0.5em;
  }

  footer {
    flex: 0 0 auto;

    width: 100%;
    box-sizing: border-box;
    margin-top: 2rem;
    border-top: 2px solid #333;
    padding-top: 1rem;
    padding-right: 0.5rem;

    display: flex;
    flex-flow: row wrap;
    justify-content: flex-end;
    align-items: center;
    column-gap: 1em;

    font-family: "Open Sans";
    font-size: 20px;
  }

  footer button {
    font-size: 18px;
    padding: 0.6em;

    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    column-gap: 4px;
  }

  button.key {
    position: relative;
    box-shadow: 4px 4px #333;
    margin-right: 4px;

    outline: none;
    border: 2px solid #333;
    background: white;

    font-family: "Ubuntu Mono";
  }

  button.pressable:active {
    top: 4px;
    left: 4px;
    box-shadow: none;
  }
</style>

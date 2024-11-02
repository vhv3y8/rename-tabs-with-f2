<script module>
  import TabItem from "./components/TabItem.svelte"

  let tabIdToFocus = await chrome.runtime
    .sendMessage("TABID")
    .then((activeTabId) => activeTabId)
  let tabInfoArray = await chrome.tabs
    .query({ currentWindow: true, active: false })
    .then((tabs) =>
      tabs.map(({ id, title, favIconUrl, index }) => ({
        id,
        title,
        favIconUrl,
        index,
      })),
    )

  // Only Tab Id To TabInfo is used
  let tabIdToTabInfo = {}
  for (const tabInfo of tabInfoArray) {
    tabIdToTabInfo[tabInfo.id] = {
      ...tabInfo,
      hasChanged: false,
    }
  }
  console.log("tabId to tab info: ", tabIdToTabInfo)

  function onTitleInputChange(e) {
    tabIdToTabInfo[e.detail.id].title = e.detail.title
    tabIdToTabInfo[e.detail.id].hasChanged = true
    console.log(tabIdToTabInfo)
  }

  function apply() {
    // to trigger change event for focused input element
    focusNextElement()
    focusPreviousElement()

    Promise.all(
      Object.values(tabIdToTabInfo)
        .filter((tabInfo) => tabInfo.hasChanged)
        .map((tabInfo) => {
          // send changed title to each content script
          chrome.tabs.sendMessage(tabInfo.id, {
            title: tabInfo.title,
          })
        }),
    ).then(() => {
      // close window after sending message is done
      window.close()
    })
  }

  /* Focus Functions */
  // mainly generated with ChatGPT

  function getFocusableElements(container = document) {
    return Array.from(
      // container.querySelectorAll(
      //   'a, button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])',
      // ),
      container.querySelectorAll("input"),
    ).filter(
      (el) => !el.hasAttribute("disabled") && !el.getAttribute("aria-hidden"),
    )
  }

  function focusNextElement() {
    const focusableElements = getFocusableElements()
    console.log(focusableElements)
    const index = focusableElements.indexOf(document.activeElement)
    const nextIndex = (index + 1) % focusableElements.length
    focusableElements[nextIndex].click()
    focusableElements[nextIndex].scrollIntoView({ block: "center" })
  }

  function focusPreviousElement() {
    const focusableElements = getFocusableElements()
    console.log(focusableElements)
    const index = focusableElements.indexOf(document.activeElement)
    const prevIndex =
      (index - 1 + focusableElements.length) % focusableElements.length
    focusableElements[prevIndex].click()
    focusableElements[prevIndex].scrollIntoView({ block: "center" })
  }
</script>

<script>
  import { onMount } from "svelte"

  let ulElem
  let ctrlEnterBtn, tabKey, shiftTabKey, enterKey, shiftEnterKey, escKey
  onMount(() => {
    console.log("onMount")
    const elemToFocus = ulElem.querySelector(
      `[data-id='${tabIdToFocus}'] input`,
    )
    elemToFocus.click()
    elemToFocus.scrollIntoView({ block: "center" })

    document.addEventListener("keydown", (e) => {
      // set keydownElem based on e.key
      let keydownElem
      switch (e.key) {
        case "Tab": {
          e.preventDefault()

          if (e.shiftKey) {
            keydownElem = shiftTabKey
            focusPreviousElement()
          } else {
            keydownElem = tabKey
            focusNextElement()
          }
          break
        }
        case "Enter": {
          e.preventDefault()

          if (e.ctrlKey) {
            apply()
          } else if (e.shiftKey) {
            keydownElem = shiftEnterKey
            focusPreviousElement()
          } else {
            keydownElem = enterKey
            focusNextElement()
          }
          break
        }
        case "Escape": {
          e.preventDefault()

          keydownElem = escKey
          ulElem.querySelector(`[data-id='${tabIdToFocus}'] input`).click()
          break
        }
        default: {
          if (e.ctrlKey) {
            keydownElem = ctrlEnterBtn

            console.log(tabInfoArray)
          }
        }
      }

      // if keydownElem isnt undefined, add keydown class to it
      keydownElem && keydownElem.classList.add("keydown")
    })

    // remove keydown class on keyup
    document.addEventListener("keyup", (e) => {
      for (const keyElem of [
        ctrlEnterBtn,
        tabKey,
        shiftTabKey,
        enterKey,
        shiftEnterKey,
        escKey,
      ]) {
        keyElem.classList.remove("keydown")
      }
    })
  })
</script>

<!-- HTML -->

<main>
  <header>
    <span
      >{chrome.i18n.getMessage("header_focus_initial")} :
      <button bind:this={escKey} class="key">ESC</button>
    </span>
    <span
      >{chrome.i18n.getMessage("header_next")} :
      <button bind:this={tabKey} class="key">Tab</button>
      /
      <button bind:this={enterKey} class="key">Enter</button></span
    >
    <span>
      <span>{chrome.i18n.getMessage("header_previous")} : </span>
      <button bind:this={shiftTabKey} class="key">Shift + Tab</button>
      /
      <button bind:this={shiftEnterKey} class="key">Shift + Enter</button>
    </span>
  </header>
  <ul bind:this={ulElem}>
    {#each Object.values(tabIdToTabInfo) as tabInfo}
      {#key tabInfo.index}
        <TabItem
          favIconUrl={tabInfo.favIconUrl || "/globe.svg"}
          title={tabInfo.title}
          id={tabInfo.id}
          on:update={onTitleInputChange}
        />
      {/key}
    {/each}
  </ul>
  <footer>
    <span>{chrome.i18n.getMessage("footer_save_and_close")} :</span>
    <button
      id="ctrlEnterBtn"
      class="key pressable"
      bind:this={ctrlEnterBtn}
      on:click={apply}>Ctrl + Enter</button
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

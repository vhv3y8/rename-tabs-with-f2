<script lang="ts">
import Key from "@main/infra/ui/components/Key.svelte"
import { notConnected } from "@main/bootstrap.svelte"
import { reload } from "./states/reload.svelte"
import { notConnectedCard } from "./states/notConnected.svelte"
import { tabItemComponents } from "./states/tabItemComponents.svelte"
import { settingModal } from "../setting/states/settingModal.svelte"
// use case handlers
import {
  clickReloadUseCaseHandler,
  keydownReloadUseCaseHandler,
} from "../../input/reload"

let allCount = $derived(notConnected.allTabs.length)
let reloadCount = $derived(notConnected.reloadConnectableTabs.length)
let policyCount = $derived(notConnected.policyBlockedTabs.length)

function handleDismiss() {
  notConnectedCard.hideCardIfVisible()
  tabItemComponents.focusCurrentItem()
}

function keydownDismissHandler(e: KeyboardEvent) {
  if (settingModal.listen) return

  if (e.code === "KeyW" && e.shiftKey && notConnectedCard.show) {
    e.preventDefault()
    handleDismiss()

    if (import.meta.env.MODE === "development") console.log("[KeyW, shiftKey]")
  }
}
// async function keydownNotConnectedCardHandler(e: KeyboardEvent) {
//   if (settingModal.listen) return

//   switch (e.code) {
//     // shift + r fire reload
//     case "KeyR": {
//       if (
//         e.shiftKey &&
//         notConnectedCard.show &&
//         0 < notConnected.reloadConnectableTabs.length
//       ) {
//         e.preventDefault()
//         await fireReload()

//         if (import.meta.env.MODE === "development")
//           console.log("[KeyR, shiftKey]")
//       }
//       break
//     }
//     default: {
//       cancelAllNotConnectedCardKeydowns()
//     }
//   }
// }
</script>

<!-- HTML -->

<svelte:document
  onkeydown={(e: KeyboardEvent) => {
    // use case
    keydownReloadUseCaseHandler(e)
    // ui
    keydownDismissHandler(e)
  }}
/>

<div id="notConnectedCardContainer">
  {#if allCount && notConnectedCard.show}
    <div id="notConnectedCard">
      <div class="header">
        <span style:font-size="1rem">
          <!-- TODO: fix -->
          {chrome.i18n.getMessage("card_msg", [
            allCount.toString(),
            1 < allCount ? "s are" : " is",
          ])}
        </span>

        <div class="close containsKeyBtn">
          {chrome.i18n.getMessage("card_btn_dismiss")} : <Key
            props={{
              darkTheme: true,
              shadow: "base",
              padding: "0.4em",
              fontSize: "15px",
              onclick: handleDismiss,
            }}>Shift + W</Key
          >
        </div>
      </div>
      <!-- reload connectable tabs -->
      <ul>
        {#if 0 < reloadCount}
          <li>
            <p class="description">
              {chrome.i18n.getMessage("card_connectable", [
                reloadCount.toString(),
                1 < reloadCount ? "s" : "",
              ])} :
            </p>
            <p class="titles">
              {notConnected.reloadConnectableTabs
                .map(({ title }) => title)
                .join(" , ")}
            </p>
          </li>
          <div style:text-align="right">
            <div class="right containsKeyBtn" style:padding-block="4px 3px">
              {#if reload.isWaiting()}
                {chrome.i18n.getMessage("card_btn_reload_all")} : <Key
                  props={{
                    darkTheme: true,
                    shadow: "small",
                    padding: "0.4em",
                    fontSize: "15px",
                    onclick: clickReloadUseCaseHandler,
                  }}>Shift + R</Key
                >
              {:else}
                <Key
                  props={{
                    darkTheme: true,
                    shadow: "none",
                    padding: "0.4em",
                  }}>{chrome.i18n.getMessage("card_reloading")}</Key
                >
              {/if}
            </div>
          </div>
        {/if}

        <!-- policy blocked tabs -->
        {#if 0 < policyCount}
          <li>
            <p class="description">
              {chrome.i18n.getMessage("card_blocked", [
                policyCount.toString(),
                1 < policyCount ? "s" : "",
              ])} :
            </p>
            <p class="titles">
              {notConnected.policyBlockedTabs
                .map(({ title }) => title)
                .join(" , ")}
            </p>
          </li>
        {/if}
      </ul>
    </div>
  {/if}
</div>

<!-- Style -->

<style>
div#blurDescriptionContainer {
  margin-block: 1rem;
}
div#blurDescription {
  font-family: "Ubuntu";

  font-size: 14px;
  background: var(--primary-8);
  color: var(--bg);
  padding: 0.8em;
  padding-bottom: 1.3em;
  border-radius: 4px;

  position: relative;
  /* margin-inline: 0.7em; */
  box-shadow: 0 0 2px var(--primary-8);
}
div#blurDescription ul {
  margin-top: 0.5em;
  list-style-type: disc;
  padding-left: 1.5rem;
  /* padding-left: 2rem; */
  padding-right: 0;

  display: flex;
  flex-flow: column nowrap;
  gap: 0;

  /* font-size: 0.9em; */
}
div#blurDescription p.description {
  font-size: 15px;
  margin-bottom: 0.7em;
}
div#blurDescription p.titles {
  line-height: 1.5;
  font-size: 0.95em;
}

/* button.key.reversed {
  box-shadow: 2px 2px var(--bg);
  margin-right: 2px;
  background: var(--primary-8);
  color: var(--bg);
  border-color: var(--bg);
}
button.key.reversed:active {
  top: 2px;
  left: 2px;
  box-shadow: none;
} */

div#blurDescription div.header {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1em;
}

div#blurDescription button.key {
  font-size: 1em;
  padding: 0.4em;
}
div#blurDescription div.close {
  /* position: relati;
  top: 0;
  right: 0; */
  /* padding-top: 4px;
  padding-right: 2px; */
}
div#blurDescription div.right {
  margin-left: auto;
}
div.containsKeyBtn {
  font-size: 15px;
}
</style>

<script lang="ts">
import Key from "@main/infra/ui/components/Key.svelte"
import { reload } from "./states/reload.svelte"
import { notConnectedCard } from "./states/notConnected.svelte"
import { settingModal } from "../setting/states/settingModal.svelte"
import { tabItemComponents } from "./states/tabItemComponents.svelte"
import { getInjections } from "../../injections"

const notConnected = $derived(getInjections().notConnected)
let allCount = $derived(notConnected.allTabs.length)
let reloadCount = $derived(notConnected.reloadConnectableTabs.length)
let policyCount = $derived(notConnected.policyBlockedTabs.length)

function handleDismiss() {
  notConnectedCard.hideCardIfVisible()
  tabItemComponents.focusCurrentItem()
}

function keydownDismissHandler(e: KeyboardEvent) {
  if (settingModal.listen) return

  if (notConnectedCard.show && e.code === "KeyW" && e.shiftKey) {
    e.preventDefault()
    handleDismiss()

    if (import.meta.env.MODE === "development") console.log("[KeyW, shiftKey]")
  }
}

const { keydownReloadUseCaseHandler, clickReloadUseCaseHandler, setting } =
  getInjections()
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
              point: "coralorange",
              pointBgOpposite: setting.darkmode,
              pointOnHover: true,
              shadow: "small",
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
                <Key
                  props={{
                    id: "reloadingBtn",
                    pressable: false,
                    // isKeyDown: true,
                    // point: "coralorange",
                    darkTheme: true,
                    shadow: "none",
                    padding: "0.4em",
                    fontSize: "15px",
                  }}>{chrome.i18n.getMessage("card_reloading")}</Key
                >
              {:else}
                {chrome.i18n.getMessage("card_btn_reload_all")} : <Key
                  props={{
                    darkTheme: true,
                    point: "coralorange",
                    pointBgOpposite: setting.darkmode,
                    pointOnHover: true,
                    shadow: "small",
                    padding: "0.4em",
                    fontSize: "15px",
                    onclick: clickReloadUseCaseHandler,
                  }}>Shift + R</Key
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
div#notConnectedCardContainer {
  margin-block: 1rem;
}
div#notConnectedCard {
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
div#notConnectedCard ul {
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

p.description {
  font-size: 15px;
  margin-bottom: 0.7em;
}
p.titles {
  line-height: 1.5;
  font-size: 0.95em;
}

div.header {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1em;
}

:global(#reloadingBtn) {
  color: var(--point-cornflower-dark);
  border-color: var(--point-cornflower-dark);
  border-width: 5px;
  /* font-weight: bold; */
}
:global(#reloadingBtn.pointBgOpposite) {
  color: var(--point-cornflower-light);
  border-color: var(--point-cornflower-light);
}

/* #notConnectedCardContainer :global(button.key) {
  font-size: 1em;
  padding: 0.4em;
} */

.right {
  margin-left: auto;
}
div.containsKeyBtn {
  font-size: 15px;
}
</style>

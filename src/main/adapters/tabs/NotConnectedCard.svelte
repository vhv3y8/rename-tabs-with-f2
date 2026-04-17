<script lang="ts">
import {
  notConnectedCardState,
  notConnectedTabLists,
} from "./states/notConnected.svelte"
import { fireReload, reloadState } from "./states/reload.svelte"
import { tabItemComponents } from "./states/tabItemComponents.svelte"

// content script unavailable tabs count
let allCount = $derived(notConnectedTabLists.allTabs.length)

// classified unavailable tabs and counts
// let { refreshUnavailableTabs, browserUnavailableTabs } = $derived(
//   getRefreshAndBrowserUnavailableTabs(),
// )
let { refreshCount, browserCount } = $derived({
  refreshCount: notConnectedTabLists.reloadConnectableTabs.length,
  browserCount: notConnectedTabLists.policyBlockedTabs.length,
})
</script>

<!-- HTML -->

<div id="blurDescriptionContainer">
  {#if allCount && notConnectedCardState.show}
    <div id="blurDescription">
      <div class="header">
        <span style:font-size="1rem">
          <!-- TODO -->
          {chrome.i18n.getMessage("card_msg", [
            allCount.toString(),
            1 < allCount ? "s are" : " is",
          ])}
        </span>

        <div class="close containsKeyBtn">
          {chrome.i18n.getMessage("card_btn_dismiss")} : <Key
            themeReversed={true}
            largeShadow={false}
            padding={"0.4em"}
            fontSize={"15px"}
            onclick={() => {
              // hideUnavailableCardIfItsVisible()
              // focusTabItem({ current: true })
              tabItemComponents.focusNextItem()
            }}>Shift + W</Key
          >
        </div>
      </div>

      <ul>
        {#if 0 < refreshCount}
          <li>
            <p class="description">
              {chrome.i18n.getMessage("card_connectable", [
                refreshCount.toString(),
                1 < refreshCount ? "s" : "",
              ])} :
            </p>

            <p class="titles">
              {notConnectedTabLists.reloadConnectableTabs
                .map(({ title }) => title)
                .join(" , ")}
            </p>
          </li>

          <div style:text-align="right">
            <div class="right containsKeyBtn" style:padding-block="4px 3px">
              {#if reloadState.isWaiting()}
                {chrome.i18n.getMessage("card_btn_reload_all")} : <Key
                  themeReversed={true}
                  largeShadow={false}
                  padding={"0.4em"}
                  fontSize={"15px"}
                  onclick={fireReload}>Shift + R</Key
                >
              {:else}
                <Key
                  themeReversed={true}
                  padding={"0.4em"}
                  fontSize={"15px"}
                  noShadow={true}
                  >{chrome.i18n.getMessage("card_reloading")}</Key
                >
              {/if}
            </div>
          </div>
        {/if}

        {#if 0 < browserCount}
          <li>
            <p class="description">
              {chrome.i18n.getMessage("card_blocked", [
                browserCount.toString(),
                1 < browserCount ? "s" : "",
              ])} :
            </p>
            <p class="titles">
              {notConnectedTabLists.policyBlockedTabs
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

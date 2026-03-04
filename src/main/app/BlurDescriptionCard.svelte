<script>
import Key from "../components/common/Key.svelte"
import { getContentScriptUnavailableTabs } from "../lib/application/tabInfo.svelte"
import {
  fireReload,
  isWaitingReload,
} from "../lib/ui/states/tabs/reload.svelte"
import { focusTabItem } from "../lib/ui/states/tabs/tabItems.svelte"
import {
  getRefreshAndBrowserUnavailableTabs,
  getShowUnavailableCard,
  hideUnavailableCardIfItsVisible,
} from "../lib/ui/states/tabs/unavailable.svelte"

// content script unavailable tabs count
let allCount = $derived(getContentScriptUnavailableTabs().length)

// classified unavailable tabs and counts
let { refreshUnavailableTabs, browserUnavailableTabs } = $derived(
  getRefreshAndBrowserUnavailableTabs(),
)
let { refreshCount, browserCount } = $derived({
  refreshCount: refreshUnavailableTabs.length,
  browserCount: browserUnavailableTabs.length,
})
</script>

<!-- HTML -->

<div id="blurDescriptionContainer">
  {#if allCount && getShowUnavailableCard()}
    <div id="blurDescription">
      <div class="header">
        <span style:font-size="1rem">
          {chrome.i18n.getMessage("card_msg", [
            allCount,
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
              hideUnavailableCardIfItsVisible()
              focusTabItem({ current: true })
            }}>Shift + W</Key
          >
        </div>
      </div>

      <ul>
        {#if 0 < refreshCount}
          <li>
            <p class="description">
              {chrome.i18n.getMessage("card_connectable", [
                refreshCount,
                1 < refreshCount ? "s" : "",
              ])} :
            </p>

            <p class="titles">
              {refreshUnavailableTabs.map(({ title }) => title).join(" , ")}
            </p>
          </li>

          <div style:text-align="right">
            <div class="right containsKeyBtn" style:padding-block="4px 3px">
              {#if !isWaitingReload()}
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
                browserCount,
                1 < browserCount ? "s" : "",
              ])} :
            </p>
            <p class="titles">
              {browserUnavailableTabs.map(({ title }) => title).join(" , ")}
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

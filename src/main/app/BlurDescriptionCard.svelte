<script>
import Key from "../components/common/Key.svelte"
import { getContentScriptUnavailableTabs } from "../lib/application/tabInfo.svelte"
import {
  fireReload,
  isWaitingReload,
} from "../lib/ui/states/tabs/reload.svelte"
import {
  // getContentScriptUnavailableTabs,
  getRefreshAndBrowserUnavailableTabs,
  getShowUnavailableCard,
  hideUnavailableCardIfItsVisible,
} from "../lib/ui/states/tabs/unavailableCard.svelte"

// let { refreshUnavailableTabs, browserUnavailableTabs } = $derived(
//   getRefreshAndBrowserUnavailableTabs(),
// )
// let refreshCount = $derived(refreshUnavailableTabs.length)
// let browserCount = $derived(browserUnavailableTabs.length)
</script>

<!-- Blurred Tabs Description -->
<div id="blurDescriptionContainer">
  <!-- {JSON.stringify(
    {
      refreshCount:
        getRefreshAndBrowserUnavailableTabs().refreshUnavailableTabs.length,
      getShowUnavailableCard: getShowUnavailableCard(),
    },
    null,
    2,
  )} / {JSON.stringify(
    [
      getRefreshAndBrowserUnavailableTabs().refreshUnavailableTabs.length,
      getRefreshAndBrowserUnavailableTabs().browserUnavailableTabs.length,
    ],
    null,
    2,
  )} -->
  {#if getContentScriptUnavailableTabs().length && getShowUnavailableCard()}
    <div id="blurDescription">
      <div class="header">
        <span style:font-size="1rem">
          {chrome.i18n.getMessage("card_msg", [
            getContentScriptUnavailableTabs().length,
            1 < getContentScriptUnavailableTabs().length ? "s are" : " is",
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
            }}>Shift + W</Key
          >
        </div>
      </div>

      <ul>
        {#if 0 < getRefreshAndBrowserUnavailableTabs().refreshUnavailableTabs.length}
          <li>
            <p class="description">
              <!-- {chrome.i18n.getMessage("card_connectable", [
                browserCount,
                1 < browserCount ? "s" : "",
              ])} : -->
              {chrome.i18n.getMessage("card_connectable", [
                getRefreshAndBrowserUnavailableTabs().refreshUnavailableTabs
                  .length,
                1 <
                getRefreshAndBrowserUnavailableTabs().refreshUnavailableTabs
                  .length
                  ? "s"
                  : "",
              ])} :
            </p>

            <p class="titles">
              {getRefreshAndBrowserUnavailableTabs()
                .refreshUnavailableTabs.map(({ title }) => title)
                .join(" , ")}
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

        {#if 0 < getRefreshAndBrowserUnavailableTabs().browserUnavailableTabs.length}
          <li>
            <p class="description">
              <!-- {chrome.i18n.getMessage("card_blocked", [
                browserCount,
                1 < browserCount ? "s" : "",
              ])} : -->
              {chrome.i18n.getMessage("card_blocked", [
                getRefreshAndBrowserUnavailableTabs().browserUnavailableTabs
                  .length,
                1 <
                getRefreshAndBrowserUnavailableTabs().browserUnavailableTabs
                  .length
                  ? "s"
                  : "",
              ])} :
            </p>
            <p class="titles">
              {getRefreshAndBrowserUnavailableTabs()
                .browserUnavailableTabs.map(({ title }) => title)
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
/* Blurred Tabs Description */
div#blurDescriptionContainer {
  margin-block: 1rem;
}
div#blurDescription {
  /* color: var(--primary-8); */
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

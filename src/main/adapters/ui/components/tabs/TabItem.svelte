<script lang="ts">
import { getInjections } from "../../injections"
import type { TabInfoState } from "./states/tabInfoRecord.svelte"
import { tabItemComponents } from "./states/tabItemComponents.svelte"

let elem = null

let { tabInfo }: { tabInfo: TabInfoState } = $props()
let localTitle = $state(tabInfo.title)
let focusableIdx = $derived(
  tabItemComponents.focusableIdxFromTabIdLookup[tabInfo.id],
)

function applyLocalTitle() {
  if (!tabInfo.hasChanged) {
    tabInfo.title = localTitle
    tabInfo.hasChanged = true
  }
}

export function focusTabInput(): void {
  elem.select()
  elem.scrollIntoView({ block: "center" })
}
export function isContentScriptConnected(): boolean {
  return tabInfo.connected
}
export function tabId(): number {
  return tabInfo.id
}
// debug
export function getTabInfo() {
  return tabInfo
}
</script>

<!-- HTML -->

<li class:unselectable={!tabInfo.connected}>
  <label>
    <img
      src={tabInfo.favIconUrl || "/globe.svg"}
      alt=""
      width="24"
      height="24"
    />
    <input
      type="text"
      name=""
      bind:this={elem}
      bind:value={localTitle}
      spellcheck="false"
      onclick={(e) => {
        focusTabInput()
        tabItemComponents.updateCurrentFocusIdx(focusableIdx)
      }}
      onchange={applyLocalTitle}
    />
  </label>
</li>

<!-- Style -->

<style>
li {
  width: 100%;
}
li.unselectable {
  opacity: 0.3;
  pointer-events: none;
}
li label {
  width: 100%;

  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  column-gap: 1em;

  margin-bottom: 1em;
}
li img {
  flex: 0 0 auto;
}
li input[type="text"] {
  flex: 1 0 auto;

  font-family: "Ubuntu";
  font-size: 18px;
  outline: none;

  padding: 0.6em;
  border: 2px solid;
  border-color: var(--primary-7);
  background-color: var(--bg);
  color: var(--primary-9);
}
</style>

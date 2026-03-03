<script>
let { tabInfo } = $props()
// setCurrentFocusInputIdx

let localTitle = $state(tabInfo.title)
let elem = null

function applyLocalTitle() {
  if (!tabInfo.hasChanged) {
    tabInfo.title = localTitle
    tabInfo.hasChanged = true
  }
}

export function focusTabInput() {
  elem.click()
  elem.scrollIntoView({ block: "center" })
}

export function isContentScriptAvailable() {
  return tabInfo.contentScriptAvailable
}

export function tabId() {
  return tabInfo.id
}

// debug
export function getTabInfo() {
  return tabInfo
}
</script>

<!-- HTML -->

<li class:unselectable={!tabInfo.contentScriptAvailable}>
  <!-- for={`tab-${tabInfo.id}`} -->
  <label>
    <img
      src={tabInfo.favIconUrl || "/globe.svg"}
      alt=""
      width="24"
      height="24"
    />
    <!-- id={`tab-${tabInfo.id}`} -->
    <input
      type="text"
      name=""
      bind:this={elem}
      bind:value={localTitle}
      spellcheck="false"
      onclick={(e) => {
        e.target.select()
        // setCurrentFocusInputIdx()
      }}
      onchange={applyLocalTitle}
    />
  </label>
</li>

<!-- Style -->

<style>
.unselectable {
  opacity: 0.3;
  pointer-events: none;
}

li {
  width: 100%;
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

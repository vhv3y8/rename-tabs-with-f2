<script>
  let { tabInfo, setCurrentFocusInputIdx } = $props()

  let localTitle = $state(tabInfo.title)
</script>

<li>
  <label for={`tab-${tabInfo.id}`}>
    <img
      src={tabInfo.favIconUrl || "/globe.svg"}
      alt=""
      width="24"
      height="24"
    />
    <input
      type="text"
      name=""
      id={`tab-${tabInfo.id}`}
      bind:value={localTitle}
      spellcheck="false"
      onclick={(e) => {
        e.target.select()
        setCurrentFocusInputIdx()
      }}
      onchange={(e) => {
        if (!tabInfo.hasChanged) {
          tabInfo.title = localTitle
          tabInfo.hasChanged = true
        }
      }}
    />
  </label>
</li>

<style>
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
    padding: 0.6em;
    border: 2px solid #444;
    outline: none;
  }
</style>

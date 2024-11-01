<script module>
  import TabItem from "./components/TabItem.svelte"

  let tabIdToFocus = await chrome.runtime
    .sendMessage("TABID")
    .then((f2PressedTabId) => f2PressedTabId)
  let tabInfoArray = await chrome.tabs
    .query({ currentWindow: true })
    .then((tabs) =>
      tabs.map(({ id, title, favIconUrl }) => ({ id, title, favIconUrl })),
    )
  console.log(tabInfoArray)
</script>

<main>
  <ul>
    {#each tabInfoArray as tabInfo}
      <TabItem
        favIconUrl={tabInfo.favIconUrl || "/globe.svg"}
        title={tabInfo.title}
        id={tabInfo.id}
      />
    {/each}
  </ul>
  <p></p>
</main>

<style>
</style>

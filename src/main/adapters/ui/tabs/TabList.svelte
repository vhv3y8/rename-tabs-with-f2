<script lang="ts">
import { tabIdxInfoStore } from "@main/bootstrap.svelte"
import { tabItemComponents } from "./states/tabItemComponents.svelte"
import TabItem from "./TabItem.svelte"
</script>

<!-- HTML -->

<ul>
  {#each Object.values(tabIdxInfoStore) as tabInfo, idx}
    <TabItem bind:this={tabItemComponents.components[idx]} {tabInfo} />
  {/each}
</ul>

<!-- Style -->

<style>
ul {
  flex: 1 1 0px;
  overflow-y: auto;

  padding: 0;
  width: 100%;

  padding-right: 1em;
  box-sizing: border-box;
}

ul::-webkit-scrollbar {
  width: 0.6rem;
}
ul::-webkit-scrollbar-thumb {
  background-color: var(--shadow-9);
  border: 3px solid var(--shadow-9);
}
</style>

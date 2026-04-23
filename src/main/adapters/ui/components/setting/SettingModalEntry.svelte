<script lang="ts">
import type { Snippet } from "svelte"

let {
  title,
  liClassName = "",
  flexCol = false,
  children,
}: {
  title: {
    content: string
    appearance: "inline" | "block"
  }
  liClassName?: string
  flexCol?: boolean
  children: Snippet
} = $props()
</script>

<!-- HTML -->

<li class={`${liClassName ? liClassName : ""}`} class:flexCol>
  {#if title.appearance === "inline"}
    <span>{title.content} :</span>
  {:else if title.appearance === "block"}
    <p><span>{title.content} :</span></p>
  {/if}

  {@render children()}
</li>

<!-- CSS -->

<style>
li {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  align-items: center;
  gap: 2em;
}
li span {
  font-size: 0.9em;
}
li.flexCol {
  flex-flow: column nowrap;
  align-items: flex-start;
  gap: 0.55em;
}
</style>

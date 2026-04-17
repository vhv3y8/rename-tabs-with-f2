<script lang="ts">
import type { Snippet } from "svelte"

let {
  title,
  flexCol = false,
  children,
}: {
  title: {
    content: string
    appearance: "inline" | "block"
  }
  flexCol?: boolean
  children: Snippet
} = $props()
</script>

<!-- HTML -->

<li class:flexCol>
  {#if title.appearance === "inline"}
    <span>{title.content} :</span>
  {:else if title.appearance === "block"}
    <p><span>{title.content} :</span></p>
  {/if}

  {@render children()}
</li>

<!-- CSS -->

<style>
li.flexCol {
  flex-flow: column nowrap;
  align-items: flex-start;
  gap: 0.55em;
}
</style>

<script>
let {
  zIndex = 100,
  opacity = 1,
  onclose,
  padding = "0.7em 0.8em",
  children,
} = $props()
</script>

<!-- HTML -->

<div class="popover" style:z-index={zIndex} style:opacity style:padding>
  {@render children?.()}
</div>

<!-- svelte-ignore a11y_consider_explicit_label -->
<button type="button" class="popoverBackground" onclick={onclose}></button>

<!-- Style -->

<style>
div.popover {
  position: absolute;
  bottom: calc(100% + 0.4em);
  background-color: inherit;

  /* padding: 0.7em 0.8em; */
  border: 2px solid var(--primary-7);
  box-shadow: 0 0 2px 2px var(--shadow-1);
  background: var(--bg);

  /* z-index: 100; */
}

button.popoverBackground {
  position: fixed;
  inset: 0;
  margin: 0;
  padding: 0;

  outline: none;
  border: none;
  background-color: transparent;

  z-index: 99;
}
</style>

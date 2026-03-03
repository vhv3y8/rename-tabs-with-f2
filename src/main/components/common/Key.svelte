<script>
import { onMount } from "svelte"

let {
  cssPressable = true,
  largeShadow = true,
  themeReversed = false,
  padding = "0.5em",
  fontSize = "",
  noShadow = false,
  keydown = false,
  children,
  id,
  onclick = () => {},
  onmousedown = () => {},
  onmouseup = () => {},
} = $props()
let elem = $state(null)

const classes = ["key"]

onMount(() => {
  // css from props
  elem.style.padding = padding
  if (fontSize !== "") elem.style.fontSize = fontSize
  if (noShadow) {
    elem.style.boxShadow = "none"
    elem.style.margin = "0"
    elem.parentElement.style.pointerEvents = "none"
  }

  // classes
  if (cssPressable) classes.push("pressable")
  if (largeShadow) classes.push("large")
  if (themeReversed) classes.push("reversed")
  elem.classList.add(...classes)
})

// exports
export function getElem() {
  return elem
}
</script>

<!-- HTML -->

<button
  type="button"
  class="key"
  class:keydown
  {onclick}
  {onmousedown}
  {onmouseup}
>
  <div bind:this={elem} {id} class="keyInner">
    {@render children?.()}
  </div>
</button>

<!-- Style -->

<style>
/* key */

button.key {
  padding: 0;
  margin: 0;
  border: 0;
  box-shadow: none;
  background-color: inherit;
}

:global(.keyInner) {
  position: relative;
  margin-right: 2px;
  margin-bottom: 2px;
  outline: none;
  font-family: "Ubuntu Mono";

  transition: background-color 0.055s ease-out;
}
:global(.keyInner.large) {
  margin-right: 4px;
  margin-bottom: 4px;
}

/* keydown */
:global(button.keydown) :global(div.keyInner) {
  background-color: cornflowerblue !important;
}

/* reversed */

:global(.keyInner) {
  display: flex;
  justify-content: center;

  box-shadow: 2px 2px var(--primary-8);
  border: 2px solid var(--primary-8);
  background: var(--bg);
  color: var(--primary-9);
}
:global(.keyInner.reversed) {
  box-shadow: 2px 2px var(--bg);
  border: 2px solid var(--bg);
  background: var(--primary-8);
  color: var(--bg);
}

:global(.keyInner.large) {
  box-shadow: 4px 4px var(--primary-8);
}
:global(.keyInner.large.reversed) {
  box-shadow: 4px 4px var(--bg);
}

/* pressable */

button:active :global(div.keyInner.pressable) {
  top: 2px;
  left: 2px;
  box-shadow: none;
}
button:active :global(div.keyInner.pressable.large) {
  top: 4px;
  left: 4px;
}
</style>

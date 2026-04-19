<script lang="ts">
import { onMount, type Snippet } from "svelte"

type KeyProps = {
  pressable: boolean
  isKeyDown: boolean

  shadow: "none" | "small" | "base"
  padding: string | null
  fontSize: string | null
  darkTheme: boolean
  id?: string

  onclick: (e?: MouseEvent) => void
  onmousedown: (e?: MouseEvent) => void
  onmouseup: (e?: MouseEvent) => void
  repeatClickHandlerWithMouseDown: boolean
}
const defaultKeyProps: KeyProps = {
  pressable: true,
  isKeyDown: false,

  shadow: "base",
  padding: "0.5em",
  fontSize: null,
  darkTheme: false,

  onclick: () => {},
  onmousedown: () => {},
  onmouseup: () => {},
  repeatClickHandlerWithMouseDown: false,
}
let {
  props = defaultKeyProps,
  children,
}: { props: Partial<KeyProps>; children: Snippet } = $props()
console.log("[key] [props]", props)

const repeatMousedownThreshold = 100
let repeatMousedownTimer = null
let movedByMousedownCount = 0

let elem: HTMLElement | null = $state(null)
const classes = ["key"]
onMount(() => {
  if (elem) {
    // css from props
    elem.style.padding = props.padding
    if (props.fontSize !== "") elem.style.fontSize = props.fontSize
    if (props.shadow === "none") {
      elem.style.boxShadow = "none"
      elem.style.margin = "0"
      elem.parentElement.style.pointerEvents = "none"
    }

    // classes
    if (props.pressable) classes.push("pressable")
    if (props.shadow === "base") classes.push("large")
    if (props.darkTheme) classes.push("reversed")
    elem.classList.add(...classes)
  }
})

// exports
export function getElem() {
  return elem
}
</script>

<!-- HTML -->

<button
  bind:this={elem}
  type="button"
  class="key p-0 m-0 border-0 shadow-none bg-inherit outline-none"
  class:keydown={props.isKeyDown}
  onclick={() => {
    if (props.repeatClickHandlerWithMouseDown) {
      if (movedByMousedownCount === 0) props.onclick?.()
    } else {
      props.onclick?.()
    }
  }}
  onmousedown={() => {
    if (props.repeatClickHandlerWithMouseDown) {
      repeatMousedownTimer = setInterval(() => {
        console.log("[running mousedown]")
        movedByMousedownCount += 1
        props.onclick?.()
      }, repeatMousedownThreshold)
      props.onmousedown?.()
    } else {
      props.onmousedown?.()
    }
  }}
  onmouseup={() => {
    if (props.repeatClickHandlerWithMouseDown) {
      clearInterval(repeatMousedownTimer)
      repeatMousedownTimer = null
      movedByMousedownCount = 0
      props.onmouseup?.()
    } else {
      props.onmouseup?.()
    }
  }}
>
  <div
    bind:this={elem}
    id={props.id || undefined}
    class="keyInner relative mr-0.5 mb-0.5 outline-none"
  >
    {@render children?.()}
  </div>
</button>

<!-- Style -->

<style>
/* key */

button.key {
  /* padding: 0;
  margin: 0;
  border: 0;
  box-shadow: none;
  background-color: inherit;
  outline: none; */
}

:global(.keyInner) {
  /* position: relative;
  margin-right: 2px;
  margin-bottom: 2px;
  outline: none; */
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

<script lang="ts">
import { cancelAllKeydowns } from "@main/adapters/ui/components/reactivity/keys.svelte"
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
  fontSize: "initial",
  darkTheme: false,

  onclick: () => {},
  onmousedown: () => {},
  onmouseup: () => {},
  repeatClickHandlerWithMouseDown: false,
}
let { props, children }: { props: Partial<KeyProps>; children: Snippet } =
  $props()
const {
  pressable,
  isKeyDown,
  shadow,
  padding,
  fontSize,
  darkTheme,
  onclick,
  onmousedown,
  onmouseup,
} = $derived({ ...defaultKeyProps, ...props })

const repeatMousedownThreshold = 100
let repeatMousedownTimer = null
let movedByMousedownCount = 0
// TODO: initial threshold time 1s

let elem: HTMLElement | null = $state(null)
</script>

<!-- HTML -->

<button
  type="button"
  class="key p-0 m-0 border-0 shadow-none bg-inherit outline-none"
  onclick={() => {
    if (props.repeatClickHandlerWithMouseDown) {
      if (movedByMousedownCount === 0) onclick()
    } else {
      onclick()
    }
  }}
  onmousedown={() => {
    if (props.repeatClickHandlerWithMouseDown) {
      repeatMousedownTimer = setInterval(() => {
        console.log("[running mousedown]")
        movedByMousedownCount += 1
        onclick()
      }, repeatMousedownThreshold)
      onmousedown()
    } else {
      onmousedown()
    }
  }}
  onmouseup={() => {
    if (props.repeatClickHandlerWithMouseDown) {
      clearInterval(repeatMousedownTimer)
      repeatMousedownTimer = null
      movedByMousedownCount = 0
      cancelAllKeydowns()
      onmouseup()
    } else {
      onmouseup()
    }
  }}
>
  <div
    bind:this={elem}
    id={props.id || undefined}
    class={`keyInner relative mr-0.5 mb-0.5 outline-none`}
    class:pressable
    class:darkTheme
    class:keydown={isKeyDown}
    class:noShadow={shadow === "none"}
    class:smallShadow={shadow === "small"}
    class:largeShadow={shadow === "base"}
    style:padding
    style:font-size={fontSize}
  >
    {@render children?.()}
  </div>
</button>

<!-- Style -->

<style>
.keyInner {
  font-family: "Ubuntu Mono";
  transition: background-color 0.055s ease-out;

  display: flex;
  justify-content: center;

  box-shadow: 2px 2px var(--primary-8);
  border: 2px solid var(--primary-8);
  background: var(--bg);
  color: var(--primary-9);
}
.keyInner.darkTheme {
  box-shadow: 2px 2px var(--bg);
  border: 2px solid var(--bg);
  background: var(--primary-8);
  color: var(--bg);
}

/* shadow */
.keyInner.noShadow {
  box-shadow: none;
  margin: 0;
  pointer-events: none;
}
.keyInner.smallShadow {
  margin-right: 2px;
  margin-bottom: 2px;
  box-shadow: 2px 2px var(--primary-8);
}
.keyInner.smallShadow.darkTheme {
  box-shadow: 2px 2px var(--bg);
}
.keyInner.largeShadow {
  margin-right: 4px;
  margin-bottom: 4px;
  box-shadow: 4px 4px var(--primary-8);
}
.keyInner.largeShadow.darkTheme {
  box-shadow: 4px 4px var(--bg);
}

/* keydown */
.keydown {
  background-color: cornflowerblue !important;
}
.keydown.darkTheme {
  /* #3C5A9E */
  background-color: #3c5a9e !important;
}
/* terracotta? */
/* #D97757 */
/* #E8A082 */

/* pressable */
button:active .keyInner.pressable {
  top: 2px;
  left: 2px;
  box-shadow: none;
}
button:active .keyInner.pressable.largeShadow {
  top: 4px;
  left: 4px;
}
</style>

<script lang="ts">
import { cancelAllKeydowns } from "@main/adapters/ui/components/reactivity/keys.svelte"
import { type Snippet } from "svelte"

type KeyProps = {
  pressable: boolean
  isKeyDown: boolean

  shadow: "none" | "small" | "base"
  padding: string | null
  fontSize: string | null
  special: boolean
  point: "cornflower" | "mutedcoral" | "coralorange"
  onOpposite: boolean
  pointOnHover: boolean
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
  special: false,
  point: "cornflower",
  onOpposite: false,
  pointOnHover: false,

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
  special,
  point,
  onOpposite,
  pointOnHover,
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
    class:special
    class:onOpposite
    class:pointOnHover
    class:keydown={isKeyDown}
    class:cornflower={point === "cornflower"}
    class:mutedcoral={point === "mutedcoral"}
    class:coralorange={point === "coralorange"}
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

  box-shadow: var(--box-shadow);
  border: 2px solid;
  border-color: var(--shadow-border-color);
  background-color: var(--background-color);
  color: var(--color);

  --box-shadow: var(--box-shadow-lengths) var(--shadow-border-color);
  --box-shadow-lengths: 2px 2px;

  /* background button */
  --shadow-border-color: var(--primary-8);
  --background-color: var(--bg);
  --color: var(--primary-9);

  /* card button */
  &.onOpposite {
    --shadow-border-color: var(--bg);
    --background-color: var(--primary-8);
    --color: var(--bg);
  }

  /* shadow */
  &.noShadow {
    box-shadow: none;
    margin: 0;
    pointer-events: none;
  }
  &.smallShadow {
    margin-right: 2px;
    margin-bottom: 2px;
  }
  &.largeShadow {
    margin-right: 4px;
    margin-bottom: 4px;
    --box-shadow-lengths: 4px 4px;
  }

  /* hover */
  &.pointOnHover {
    transition: background-color 0.058s ease-in-out;
  }

  /* colors */
  /* cornflower */
  &.cornflower.keydown,
  &.cornflower.pointOnHover:hover,
  &.cornflower.pointOnHover:active {
    --background-color: var(--point-cornflower-default);
  }
  &.cornflower.special.keydown,
  &.cornflower.onOpposite.pointOnHover:hover,
  &.cornflower.onOpposite.pointOnHover:active {
    --background-color: var(--point-cornflower-opposite);
  }
  /* mutedcoral */
  &.mutedcoral.keydown,
  &.mutedcoral.pointOnHover:hover,
  &.mutedcoral.pointOnHover:active {
    --background-color: var(--point-mutedcoral-default);
  }
  &.mutedcoral.special.keydown,
  &.mutedcoral.onOpposite.pointOnHover:hover,
  &.mutedcoral.onOpposite.pointOnHover:active {
    --background-color: var(--point-mutedcoral-opposite);
  }
  /* coralorange */
  &.coralorange.keydown,
  &.coralorange.pointOnHover:hover,
  &.coralorange.pointOnHover:active {
    --background-color: var(--point-coralorange-default);
  }
  &.coralorange.special.keydown,
  &.coralorange.onOpposite.pointOnHover:hover,
  &.coralorange.onOpposite.pointOnHover:active {
    --background-color: var(--point-coralorange-opposite);
  }

  /* special */
  &.special {
    --background-color: var(--point-cornflower-opposite);
    --color: var(--bg);
    --shadow-border-color: var(--bg);
  }
}

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

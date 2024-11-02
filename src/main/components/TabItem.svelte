<script>
  import { createEventDispatcher } from "svelte"
  const dispatch = createEventDispatcher()

  export let favIconUrl
  export let title = ""
  export let id

  function selectAll(e) {
    e.target.select()
  }

  function onInputChange(e) {
    dispatch("update", {
      id,
      title: e.target.value,
    })
  }
</script>

<li data-id={id}>
  <label for={`tab-${id}`}>
    <img src={favIconUrl} alt="" width="24" height="24" />
    <input
      type="text"
      name=""
      id={`tab-${id}`}
      value={title}
      spellcheck="false"
      on:click={selectAll}
      on:change={onInputChange}
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

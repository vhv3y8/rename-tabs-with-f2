<script lang="ts">
const {
  height = "2px",
  style = "solid",
  color = "initial",
  marginBlock = "1em",
} = $props()
</script>

<!-- HTML -->

<div
  class="horizontalLine"
  style:border-top-width={height}
  style:border-top-style={style}
  style:border-top-color={color}
  style:margin-block={marginBlock}
></div>

<!-- Style -->

<style>
.horizontalLine {
  width: 100%;
  height: 0;
  margin: 0;
  padding: 0;
  border: 0;
}
</style>

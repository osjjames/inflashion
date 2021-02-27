<script lang="ts">
    export let onClick: Function;
    export let width: number = 64;
    export let height: number = 32;
</script>

<button on:click={onClick} class="flash-button bg-flash-gradient rounded-2xl w-{width} h-{height} font-semibold text-2xl border-0 shadow-flash-blue focus:outline-none">
    <slot></slot>
</button>

<style>
    .flash-button {
    }
</style>
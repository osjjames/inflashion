<script lang="ts">
    export let onClick: Function;
    export let width: number = 32;
    export let height: number = 16;
    export let selected: boolean = false;
</script>

<button on:click={onClick} class="bg-flash-gray-{selected ? '300' : '900'} rounded-full w-{width} h-{height} text-flash-gray-{selected ? '50' : '300'} border-2 border-flash-gray-300 focus:outline-none">
    <slot></slot>
</button>
<script lang="ts">
    export let onClick: Function;
    export let width: number = 16;
    export let height: number = 8;
    export let selected: boolean = false;
</script>

<button on:click={onClick} class="bg-flash-gray-{selected ? '300' : '900'} rounded-full w-{width} h-{height} text-flash-gray-{selected ? '50' : '300'} border-2 border-flash-gray-300 focus:outline-none mr-1">
    <slot></slot>
</button>
<script lang="ts">
    export let onClick: Function;
    export let active: boolean = false;
    export let activeClass: string = '';
</script>

<button on:click={onClick} class="flex items-center focus:outline-none mr-6">
    <span class="w-2.5 h-2.5 mr-1 rounded-full {active ? activeClass: 'bg-flash-gray-300'}"></span>
    <span class="text-flash-gray-{active ? '50' : '100'} hover:text-flash-gray-50">
        <slot></slot>
    </span>
</button>
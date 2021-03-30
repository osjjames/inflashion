<script lang="ts">
    export let onClick: Function;
    export let active: boolean = false;
    export let activeClass: string = '';
</script>

<button on:click={onClick} class="flex items-center focus:outline-none mr-6 last:mr-0 mb-2 md:mb-0">
    <span class="w-2.5 h-2.5 min-w-2.5 min-h-2.5 mr-2 rounded-full {active ? activeClass: 'bg-flash-gray-300'}"></span>
    <span class="text-left w-fit text-flash-gray-{active ? '50' : '100'} hover:text-flash-gray-50">
        <slot></slot>
    </span>
</button>
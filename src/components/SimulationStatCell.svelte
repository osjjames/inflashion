<script lang="ts">
    export let name: string;
    export let value: string;
</script>

<div class="w-1/2 overflow-hidden lg:w-1/4 p-2">
    <div class="w-full h-full flex flex-col items-center p-2">
        {#if name}
            <span class="font-semibold">{name}</span>
        {/if}
        {#if value}
            <span class="text-lg">{value}</span>
        {/if}
        <slot></slot>
    </div>
</div>
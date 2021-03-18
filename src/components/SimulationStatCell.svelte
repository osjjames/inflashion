<script lang="ts">
    export let name: string;
    export let value: string;
</script>

<div class="overflow-hidden p-2 border-2 border-flash-gray-600 rounded-2xl">
    <div class="w-full h-full flex flex-col items-center p-2">
        {#if name}
            <span class="font-semibold">{name}</span>
        {/if}
        <div class="flex flex-col justify-center items-center h-full">
            {#if value}
                <span class="text-xl">{value}</span>
            {/if}
            <slot></slot>
        </div>
    </div>
</div>
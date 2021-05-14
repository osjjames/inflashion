<script lang="ts">
    import {numberWithSpaces} from "../utils/format";
    import FaClock from 'svelte-icons/fa/FaClock.svelte';
    import FaRunning from 'svelte-icons/fa/FaRunning.svelte';
    import FaGlobeAmericas from 'svelte-icons/fa/FaGlobeAmericas.svelte';
    import FaBox from 'svelte-icons/fa/FaBox.svelte';
    import FaHandshake from 'svelte-icons/fa/FaHandshake.svelte';
    import FaDollarSign from 'svelte-icons/fa/FaDollarSign.svelte';
    import FaCalculator from 'svelte-icons/fa/FaCalculator.svelte';
    import FaPercent from 'svelte-icons/fa/FaPercent.svelte';

    type StatIcon = 'time' | 'fpy' | 'speed' | 'total' | 'staked' | 'matched';
    export let name: string;
    export let value: string;
    export let icon: StatIcon;
    export let joinedLeft: boolean = false;
    export let joinedRight: boolean = false;
</script>

<div class="p-2 border-2 border-flash-gray-600 rounded-2xl relative {joinedLeft ? 'border-l-0 rounded-l-none' : ''} {joinedRight ? 'border-r-0 rounded-r-none' : ''}">
    {#if icon}
        <div class="border-icon">
            {#if icon === 'time'}<FaClock/>{/if}
            {#if icon === 'fpy'}<FaCalculator/>{/if}
            {#if icon === 'speed'}<FaRunning/>{/if}
            {#if icon === 'total'}<FaDollarSign/>{/if}
            {#if icon === 'staked'}<FaBox/>{/if}
            {#if icon === 'matched'}<FaHandshake/>{/if}
        </div>
    {/if}
    <div class="w-full h-full flex flex-col items-center p-2">
        {#if name}
            <span class="font-semibold">{name}</span>
        {/if}
        <div class="flex flex-col justify-center items-center h-full">
            {#if value}
                <span class="text-xl">{numberWithSpaces(value)}</span>
            {/if}
            <slot></slot>
        </div>
    </div>
</div>

<style>
    .border-icon {
        top: -18px;
        left: 18px;
        border: 7px solid #1B1A1F;
        z-index: 1000;
        height: 36px;
        width: 36px;
        position: absolute;
        border-radius: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>
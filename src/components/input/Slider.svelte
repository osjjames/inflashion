<script lang="ts">
    import {onMount} from "svelte";

    export let min: number;
    export let max: number;
    export let stepCount: number;
    export let step: number;
    export let value: number;
    export let inputClass: string = '';
    export let vertical: boolean = false;
    export let gaussian: boolean = false;

    // Squish factor, the smaller it is the more the slider caters to small values
    const squish = 0.5;
    
    const linToLog = (value: number): number => {
        if (value === min) return min;
        if (value === min + 1) return Infinity;

        // Transformed log function with f(min) = 0, f(min+1) = Infinity
        return Math.log(1 - (value - min)) * (-1) * squish;
    }

    const logToLin = (value: number): number => {
        if (value === min) return min;
        if (value === Infinity) return min+1;
        // Inverse of linToLog function with f(0) = min, f(Infinity) = min+1
        return (min+1) - Math.exp((-1) * (value / squish));
    }

    let linValue: number = logToLin(value);
    $: log = max === Infinity;
    $: if (log) {
        value = linToLog(linValue);
    }
    $: stepBinding = step || (log ? 1/stepCount : (max-min)/stepCount) || max-min;

    const disableScroll = () => {
        // Get the current page scroll position
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        let scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

        // if any scroll is attempted, set this to the previous value
        window.onscroll = () => window.scrollTo(scrollLeft, scrollTop);
    }
    const enableScroll = () => {
        window.onscroll = () => {};
    }
</script>

<div class:vertical class:gaussian>
    {#if log}
        <input
            on:touchstart={e => disableScroll()}
            on:touchend={e => enableScroll()}
            type="range"
            {min}
            max={min+1}
            step={stepBinding}
            bind:value={linValue}
            class="{inputClass}"
        />
    {:else}
        <input
            on:touchstart={e => disableScroll()}
            on:touchend={e => enableScroll()}
            type="range"
            {min}
            {max}
            step={stepBinding}
            bind:value={value}
            class="{inputClass}"
        />
    {/if}
</div>

<style>
    input[type=range] {
        -webkit-appearance: none;
        @apply rounded-full h-2 border-0 bg-flash-gray-600 focus:outline-none;

        &::-webkit-slider-thumb {
             -webkit-appearance: none;
             @apply w-4 h-4 bg-flash-gray-100 cursor-pointer rounded-full;
         }
    }

    .gaussian {
        @apply justify-self-center self-center;
    }

    .vertical {
        display: inline-block;
        height: 7rem;
        width: 0.5rem;
        padding: 0;
        margin-top: 1rem;
        margin-right: 0rem;

        & input[type=range] {
            width: 7rem;
            margin: 0;
            transform-origin: 3.5rem 3.5rem;
            transform: rotate(270deg);
            -moz-transform: rotate(270deg);
        }
    }
</style>
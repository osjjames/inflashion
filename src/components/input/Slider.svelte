<script lang="ts">
    export let min: number;
    export let max: number;
    export let stepCount: number;
    export let value: number;
    export let inputClass: string = '';
    export let vertical: boolean = false;
    export let gaussian: boolean = false;

    let linValue: number = value;
    $: log = max === Infinity;
    $: if (log) {
        value = linToLog(linValue);
    }

    const linToLog = (value: number): number => {
        if (value === min) return min;
        if (value === min + 1) return Infinity;
        // Squish factor, the smaller it is the more the slider caters to small values
        let squish = 0.5;
        // Transformed log function with f(min) = 0, f(min+1) = Infinity
        return Math.log(1 - (value - min)) * (-1) * squish;
    }
</script>

<div class:vertical class:gaussian>
    {#if log}
        <input type="range" {min} max={min+1} step={1/stepCount} bind:value={linValue}
            class="rounded-full h-1 border-0 bg-flash-gray-300 focus:outline-none {inputClass}"
        />
    {:else}
        <input type="range" {min} {max} step={(max-min)/stepCount} bind:value={value}
               class="rounded-full h-1 border-0 bg-flash-gray-300 focus:outline-none {inputClass}"
        />
    {/if}
</div>

<style>
    input[type=range] {
        -webkit-appearance: none;

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
        margin-bottom: 1rem;

        & input[type=range] {
            width: 7rem;
            margin: 0;
            transform-origin: 3.5rem 3.5rem;
            transform: rotate(270deg);
            -moz-transform: rotate(270deg);
        }
    }
</style>
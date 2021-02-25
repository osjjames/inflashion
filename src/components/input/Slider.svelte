<script lang="ts">
    export let min: number;
    export let max: number;
    export let step: number;
    export let value: number;
    export let log: boolean = false;
    export let inputClass: string;
    export let id: string = 'slider';
    export let vertical: boolean = false;
    export let gaussian: boolean = false;

    // const logslider(value) {
    //     // position will be between 0 and 100
    //     var minp = min;
    //     var maxp = max;
    //
    //     // The result should be between 100 an 10000000
    //     var minv = Math.log(100);
    //     var maxv = Math.log(10000000);
    //
    //     // calculate adjustment factor
    //     var scale = (maxv-minv) / (maxp-minp);
    //
    //     return Math.exp(minv + scale*(position-minp));
    // }
</script>

<div class:vertical class:gaussian>
    <input id="{id}" type="range" {min} {max} {step} bind:value
        class={`rounded h-2 border-0 bg-flash-gray-300 focus:outline-none ${inputClass}`}
    />
</div>

<style>
    input[type=range] {
        -webkit-appearance: none;

        &::-webkit-slider-thumb {
             -webkit-appearance: none;
             @apply w-4 h-4 bg-gradient-to-r from-flash-pink to-flash-blue cursor-pointer rounded-full;
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
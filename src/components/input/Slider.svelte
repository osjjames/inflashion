<script lang="ts">
    export let min: number;
    export let max: number;
    export let step: number;
    export let value: number;
    export let log: boolean = false;
    export let inputClass: string;

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

<label for="slider">
    <input id="slider" type="range" {min} {max} {step} bind:value
        class={`rounded h-2 border-0 bg-flash-gray-300 focus:outline-none ${inputClass}`}
    />
</label>

<style>
    #slider {
        -webkit-appearance: none;

        &::-webkit-slider-thumb {
             -webkit-appearance: none;
             @apply w-4 h-4 bg-gradient-to-r from-flash-pink to-flash-blue cursor-pointer rounded-full;
         }
    }
</style>
<script lang="ts">
    import BellCurve from "./BellCurve.svelte";
    import Slider from "../input/Slider.svelte";

    export let mu: number = 0.5;
    export let sigma: number = 0.05;
    let widthClass: string = '64';
    let heightClass: string = '32';
</script>

<div class={`h-${heightClass} w-${widthClass} mb-8`}>
    <div class="h-full w-full">
        <BellCurve {mu} {sigma}></BellCurve>
    </div>
    <Slider inputClass={`mu-slider w-${widthClass}`} min="0" max="1" step="0.01" bind:value={mu}></Slider>
    <Slider inputClass={`sigma-slider w-${heightClass}`} min="0" max="0.1" step="0.001" bind:value={sigma}></Slider>
</div>

<style>
</style>
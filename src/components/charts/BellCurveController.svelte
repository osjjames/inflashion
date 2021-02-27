<script lang="ts">
    import BellCurve from "./BellCurve.svelte";
    import Slider from "../input/Slider.svelte";
    import pdf from 'distributions-truncated-normal-pdf';

    export let mu: number = 0.5;
    export let sigma: number = 0.05;
    export let gaussianPoints = 0;
    export let message: string = '';
    let widthClass: string = '64';
    let heightClass: string = '32';
</script>

<div class="flex">
    <div class={` mb-8 grid grid-cols-bc-controller grid-rows-bc-controller gap-0 box-border`}>
        <Slider inputClass={`sigma-slider w-24`} min="0" max="1" step="0.001" bind:value={sigma} vertical gaussian></Slider>
        <div class="h-{heightClass} w-{widthClass}">
            <BellCurve {mu} {sigma}></BellCurve>
        </div>
        <div></div>
        <Slider inputClass={`mu-slider w-${widthClass}`} min="0" max="1" step="0.01" bind:value={mu} gaussian></Slider>
    </div>
    <div class="flex flex-col justify-start text-left">
        <span>μ = {mu}</span>
        <span>σ = {sigma}</span>
        <span>{message}</span>
    </div>
</div>

<style>

</style>
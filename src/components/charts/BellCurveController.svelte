<script lang="ts">
    import BellCurve from "./BellCurve.svelte";
    import Slider from "../input/Slider.svelte";

    let mu: number = 0.5;
    let sigma: number = 0.05;
    let dimensionsClass: string = '64';
</script>

<div class={`h-32 w-${dimensionsClass}`}>
    <div class="h-full w-full">
        <BellCurve {mu} {sigma}></BellCurve>
    </div>
    <Slider inputClass={`w-${dimensionsClass}`} min="0" max="1" step="0.01" bind:value={mu}></Slider>
    <Slider inputClass={`w-${dimensionsClass}`} min="0.001" max="0.1" step="0.001" bind:value={sigma}></Slider>
</div>
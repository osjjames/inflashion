<script lang="ts">
    import BellCurve from "./BellCurve.svelte";
    import Slider from "../input/Slider.svelte";
    import pdf from 'distributions-truncated-normal-pdf';
    import type {Bounds, TruncatedNormalDistribution} from "../../utils/probability";
    import {parameters} from "../../store/simulation";
    import type {MessageGenerator} from "../../utils/simulation";

    export let mu: number = 0;
    export let sigma: number = 0;
    export let getMessage: MessageGenerator;
    let bounds: Bounds | null = null;
    let cdf: (x: number) => number;
    let widthClass: string = '64';
    let heightClass: string = '32';

    const getAreaUnderCurve = (cdf: (x: number) => number, bounds: Bounds) => {
        return cdf(bounds.upper) - cdf(bounds.lower);
    }

    const getMessageSafe = (mu: number, sigma: number, bounds: Bounds) => {
        if (!bounds) return '';
        return getMessage(mu, sigma, bounds, getAreaUnderCurve(cdf, bounds));
    }

    $: message = getMessageSafe(mu, sigma, bounds);
</script>

<div class="flex">
    <div class={` mb-8 grid grid-cols-bc-controller grid-rows-bc-controller gap-0 box-border`}>
        <Slider inputClass={`sigma-slider w-24`} min="0" max={Infinity} stepCount="1000" bind:value={sigma} vertical gaussian></Slider>
        <div class="h-{heightClass} w-{widthClass}">
            <BellCurve mu={mu} {sigma} bind:bounds bind:cdf></BellCurve>
        </div>
        <div></div>
        <Slider inputClass={`mu-slider w-${widthClass}`} min="0" max="1" stepCount="100" bind:value={mu} gaussian></Slider>
    </div>
    <div class="flex flex-col justify-start text-left">
        <span>μ = {mu}</span>
        <span>σ = {sigma === Infinity ? '∞' : sigma.toFixed(3)}</span>
        <span>{message}</span>
    </div>
</div>

<style>

</style>
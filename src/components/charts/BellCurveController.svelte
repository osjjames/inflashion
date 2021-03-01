<script lang="ts">
    import BellCurve from "./BellCurve.svelte";
    import Slider from "../input/Slider.svelte";
    import pdf from 'distributions-truncated-normal-pdf';
    import type {Bounds, TruncatedNormalDistribution} from "../../utils/probability";
    import {parameters} from "../../store/simulation";

    export let mu: number = 0;
    export let sigma: number = 0;
    export let gaussianPoints = 0;
    let bounds: Bounds | null = null;
    let cdf: (x: number) => number;
    let widthClass: string = '64';
    let heightClass: string = '32';

    const getAreaUnderCurve = (cdf: (x: number) => number, bounds: Bounds) => {
        return cdf(bounds.upper) - cdf(bounds.lower);
    }

    const getMessage = (mu: number, sigma: number, bounds: Bounds) => {
        if (!bounds) return '';
        switch (sigma) {
            case 0: return `All agents will stake for ${(mu*100).toFixed(0)}% of the maximum stake duration`;
            case Infinity: return 'All agents will stake for a totally random duration.';
            default: return `${(getAreaUnderCurve(cdf, bounds)*100).toFixed(1)}% of agents will stake for ${(bounds.lower*100).toFixed(0)}-${(bounds.upper*100).toFixed(0)}% of the maximum stake duration`
        }
    }

    $: message = getMessage(mu, sigma, bounds);
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
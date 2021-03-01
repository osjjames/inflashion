<script lang="ts">
    import BellCurve from "./BellCurve.svelte";
    import Slider from "../input/Slider.svelte";
    import pdf from 'distributions-truncated-normal-pdf';
    import type {Bounds, TruncatedNormalDistribution} from "../../utils/probability";
    import {parameters} from "../../store/simulation";
    import {truncatedCdf} from "../../utils/probability";

    export let mu: number = 0;
    export let sigma: number = 0;
    export let gaussianPoints = 0;
    let bounds: Bounds | null = null;
    let cdf: (x: number) => number;
    let widthClass: string = '64';
    let heightClass: string = '32';

    const getAreaUnderCurve = (mu: number, sigma: number, bounds: Bounds) => {
        const cdf = truncatedCdf({mu, sigma, bounds: {lower: 0, upper: 1}});
        return cdf(bounds.upper) - cdf(bounds.lower);
    }

    const getAreaUnderCurve2 = (cdf: (x: number) => number, bounds: Bounds) => {
        let upper = cdf(bounds.upper);
        let lower = cdf(bounds.lower);
        console.log(`${upper} - ${lower}`);
        return cdf(bounds.upper) - cdf(bounds.lower);
    }

    const getMessage = (mu: number, sigma: number, bounds: Bounds) => {
        if (!bounds) return '';
        switch (sigma) {
            case 0: return `All agents will stake for ${(mu*100).toFixed(0)}% of the maximum stake duration`;
            case Infinity: return 'All agents will stake for a totally random duration.';
            default: return `${(getAreaUnderCurve2(cdf, bounds)*100).toFixed(1)}% of agents will stake for ${(bounds.lower*100).toFixed(0)}-${(bounds.upper*100).toFixed(0)}% of the maximum stake duration`
        }
    }

    $: message = getMessage(mu, sigma, bounds);
</script>

<div class="flex">
    <div class={` mb-8 grid grid-cols-bc-controller grid-rows-bc-controller gap-0 box-border`}>
        <Slider inputClass={`sigma-slider w-24`} min="0" max="1" step="0.001" bind:value={sigma} vertical gaussian></Slider>
        <div class="h-{heightClass} w-{widthClass}">
            <BellCurve mu={mu} {sigma} bind:bounds bind:cdf></BellCurve>
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
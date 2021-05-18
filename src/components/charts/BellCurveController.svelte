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
    export let name: string;
    export let description: string;
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

<div class="flex flex-col lg:mx-8">
    <div class="flex flex-col items-center">
        <span><b>{name}</b></span>
        <span class="text-sm opacity-70">{description}</span>
    </div>
    <div class="mb-2 grid grid-cols-bc-controller grid-rows-bc-controller gap-0 box-border">
        <Slider inputClass={`sigma-slider w-24`} min="0" max={Infinity} stepCount="1000" bind:value={sigma} vertical gaussian></Slider>
        <div class="h-full w-full p-2">
            <div class="w-full flex justify-evenly border-2 border-b-0 border-flash-gray-600 rounded-t-2xl">
                <div class="w-1/2 pl-3">
                    <span>μ = {mu}</span>
                </div>
                <div class="w-1/2 pl-3 border-l-2 border-flash-gray-600">
                    <span>σ = {sigma === Infinity ? '∞' : sigma.toFixed(3)}</span>
                </div>
            </div>
            <div class="h-{heightClass} w-{widthClass}">
                <BellCurve mu={mu} {sigma} bind:bounds bind:cdf></BellCurve>
            </div>
        </div>
        <div></div>
        <Slider inputClass={`mu-slider w-${widthClass}`} min="0" max="1" stepCount="100" bind:value={mu} gaussian></Slider>
    </div>
    <div class="flex flex-col justify-start text-right text-sm w-72 h-16">
        <span>{message}</span>
    </div>
</div>

<style>

</style>
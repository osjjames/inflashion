<script lang="ts">
    import {Chart, Svg, SvgLine, Quadtree} from '@sveltejs/pancake';
    import SvgSmoothLine from "./pancakeExtensions/SvgSmoothLine.svelte";
    import pdf from 'distributions-truncated-normal-pdf';
    import {randomTrunc} from "../../utils/probability";
    import type {Bounds} from "../../utils/probability";
    import {scale} from "svelte/transition";

    const xMax = 100;
    const yMax = 1;

    export let mu: number = 0;
    export let sigma: number = 0;
    export let bounds: Bounds | null;
    export let cdf: (x: number) => number;
    let gaussianPoints: {x: number, y: number}[] = [];
    let xValues = [];
    let zeroPoints = [];
    let closest = undefined;
    let locked: boolean = false;

    const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

    const toggleLocked = () => {
        if (closest) {
            locked = !locked;
        }
    }

    const chartPointsFromSamples = (mu: number, sigma: number, samples: number = 1000): Array<{x: number, y: number}> => {
        const data = [];
        for (let i = 0; i < samples; i++) {
            data.push(randomTrunc({bounds: {lower: 0, upper: 1}, mu, sigma}));
        }
        let bins: number[] = new Array(xMax + 1).fill(0)
        for (let value of data) {
            bins[Math.round(value * xMax)] += 1;
        }
        const binMax = Math.max(...bins);
        return bins.map((value, i) => ({
            x: i,
            y: value * (yMax/binMax)
        }));
    }

    const chartPointsFromPdf = (mu: number, sigma: number): Array<{x: number, y: number}> => {
        const options = {a: 0, b: 1, mu, sigma};
        const gaussianValues: Number[] = pdf(xValues, options);
        const probMax: Number = pdf(mu, options);
        return gaussianValues.map((value, i) => ({
            x: i,
            y: value * (yMax / probMax)
        }));
    }

    const verticalLine = (x: number): Array<{x: number, y: number}> => {
        const scaledX = Math.round(x*xMax);
        return [{x: scaledX, y: 0}, {x: scaledX, y: yMax}];
    }

    $: xValues = Array.from(Array(xMax + 1).keys()).map(n => n/xMax);
    $: zeroPoints = xValues.map(n => ({x: n*xMax, y: 0}));
    $: gaussianPoints = sigma === 0 ? verticalLine(mu) : chartPointsFromPdf(mu, sigma);
    $: range = closest && !locked
        ? Math.abs(closest.x/xMax - mu) || range
        : range;
    $: bounds = closest ? {lower: clamp(mu - range, 0, 1), upper: clamp(mu + range, 0, 1)} : null;
    $: {
        let barAreas = gaussianPoints.map(point => point.y / (xMax+1));
        let cumulativeAreas = [];
        for (let i = 0; i < barAreas.length; i++) {
            cumulativeAreas.push(i === 0 ? 0 : cumulativeAreas[i-1] + barAreas[i-1]);
        }

        cdf = (x: number) => {
            const scaledX = Math.round(x*xMax);
            return scaledX >= cumulativeAreas.length
                ? 1
                : cumulativeAreas[scaledX] / cumulativeAreas[cumulativeAreas.length - 1];
        }
    }
</script>

<div class="h-full w-full p-2">
    <div class="h-full w-full border-2 border-b-0 border-flash-gray-600 rounded-t-2xl pb-0.5 pt-2 overflow-hidden"  class:locked on:click={toggleLocked}>
        <Chart x1={0} x2={xMax} y1={0} y2={yMax}>
            {#if sigma === 0}
                <Svg>
                    <SvgLine data={gaussianPoints} let:d>
                        <path class="data" {d}/>
                    </SvgLine>
                    <SvgLine data={[{x: 0, y: 0}, {x: xMax, y: 0}]} let:d>
                        <path class="data" {d}/>
                    </SvgLine>
                </Svg>
            {:else}
                <Svg>
                    {#if closest}
                        <SvgLine data={verticalLine(mu)} let:d>
                            <path class="data mu" {d} stroke-dasharray="2,12"/>
                        </SvgLine>
                        <SvgLine data={verticalLine(bounds.lower)} let:d>
                            <path class="data bound lower" {d} />
                        </SvgLine>
                        <SvgLine data={verticalLine(bounds.upper)} let:d>
                            <path class="data bound upper" {d}/>
                        </SvgLine>
                    {/if}
                    <SvgSmoothLine data={gaussianPoints} let:d>
                        <path class="data" {d}/>
                    </SvgSmoothLine>
                </Svg>
            {/if}
            {#if !locked}
                <Quadtree data={zeroPoints} bind:closest/>
            {/if}
        </Chart>
    </div>
</div>

<style>
    .chart {
        height: 100%;
        padding: 3em 2em 2em 3em;
        box-sizing: border-box;
    }

    .axes {
        width: 100%;
        height: 100%;
        border-left: 1px solid black;
        border-bottom: 1px solid black;
    }

    .y.label {
        position: absolute;
        left: -2.5em;
        width: 2em;
        text-align: right;
        bottom: -0.5em;
    }

    .x.label {
        position: absolute;
        width: 4em;
        left: -2em;
        bottom: -22px;
        font-family: sans-serif;
        text-align: center;
    }

    .locked {
        @apply border-flash-gray-300;
    }

    path.data {
        @apply text-flash-pink stroke-current;
        stroke-linejoin: round;
        stroke-linecap: round;
        stroke-width: 4px;
        fill: none;

        &.mu {
            stroke-width: 2px;
            stroke-linecap: butt;
        }

        &.bound {
            &.lower {
                @apply text-red-500;
            }
            &.upper {
                @apply text-green-500;
            }
            opacity: 0.6;
            stroke-width: 2px;
            stroke-linecap: butt;
        }
    }
</style>
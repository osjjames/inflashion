<script lang="ts">
    import FaLock from 'svelte-icons/fa/FaLock.svelte';
    import FaUnlock from 'svelte-icons/fa/FaUnlock.svelte';
    import {Chart, Svg, SvgLine, Quadtree} from '@sveltejs/pancake';
    import SvgSmoothLine from "./pancakeExtensions/SvgSmoothLine.svelte";
    import pdf from 'distributions-truncated-normal-pdf';
    import {randomTrunc} from "../../utils/probability";
    import type {Bounds} from "../../utils/probability";
    import {scale} from "svelte/transition";
    import type {Point2} from "../../utils/chart";

    const xMax = 200;
    const yMax = 1;

    export let mu: number = 0;
    export let sigma: number = 0;
    export let bounds: Bounds | null;
    export let cdf: (x: number) => number;
    let gaussianPoints: Point2[] = [];
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

    const chartPointsFromSamples = (mu: number, sigma: number, samples: number = 1000): Array<ChartPoint> => {
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

    const chartPointsFromPdf = (mu: number, sigma: number): Array<Point2> => {
        const options = {a: 0, b: 1, mu, sigma};
        const gaussianValues: Number[] = pdf(xValues, options);
        const probMax: Number = pdf(mu, options);
        return gaussianValues.map((value, i) => ({
            x: i,
            y: value * (yMax / probMax)
        }));
    }

    const verticalLine = (x: number): Array<Point2> => {
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
        if (sigma === 0) {
            cdf = (x: number) => x >= mu ? 1 : 0;
        } else if (sigma === Infinity) {
            cdf = (x: number) => x;
        } else {
            let barAreas = gaussianPoints.map(point => point.y / (xMax + 1));
            let cumulativeAreas = [];
            for (let i = 0; i < barAreas.length; i++) {
                cumulativeAreas.push(i === 0 ? 0 : cumulativeAreas[i - 1] + barAreas[i - 1]);
            }

            // Need to wait for cdf to be updated before it gets used
            cdf = (x: number) => {
                const scaledX = Math.round(x * xMax);
                return scaledX >= cumulativeAreas.length
                    ? 1
                    : cumulativeAreas[scaledX] / cumulativeAreas[cumulativeAreas.length - 1];
            }
        }
    }
</script>

<div class="h-full w-full border-2 border-b-0 border-flash-gray-600 pb-0.5 pt-2 overflow-hidden cursor-crosshair relative" on:click={toggleLocked}>
    <Chart x1={0} x2={xMax} y1={0} y2={yMax}>
        <Svg>
            <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#E62B96;stop-opacity:70%" />
                    <stop offset="100%" style="stop-color:#E62B96;stop-opacity:0" />
                </linearGradient>
            </defs>
            {#if sigma === 0}
                <SvgLine data={gaussianPoints} let:d>
                    <path class="data" {d}/>
                </SvgLine>
                <SvgLine data={[{x: 0, y: 0}, {x: xMax, y: 0}]} let:d>
                    <path class="data" {d}/>
                </SvgLine>
            {:else if sigma === Infinity}
                <SvgSmoothLine data={[{x: 0, y: yMax}, {x: xMax, y: yMax}]} let:d let:dFill>
                    <path class="data-fill" d={dFill} fill="url(#grad1)"/>
                    <path class="data" {d}/>
                </SvgSmoothLine>
            {:else}
                <SvgSmoothLine data={gaussianPoints} {bounds} {xMax} let:d let:dFill>
                    <path class="data-fill" d={dFill} fill="url(#grad1)"/>
                    <path class="data" {d}/>
                </SvgSmoothLine>
                {#if closest}
                    <SvgLine data={verticalLine(mu)} let:d>
                        <path class="data mu" {d} stroke-dasharray="0,12"/>
                    </SvgLine>
                    <SvgLine data={verticalLine(bounds.lower)} let:d>
                        <path class="data bound lower" {d} />
                    </SvgLine>
                    <SvgLine data={verticalLine(bounds.upper)} let:d>
                        <path class="data bound upper" {d}/>
                    </SvgLine>
                {/if}
            {/if}
        </Svg>
        {#if !locked}
            <Quadtree data={zeroPoints} bind:closest/>
        {/if}
    </Chart>
    {#if closest}
        <div class="absolute top-2 {mu > 0.5 ? 'left' : 'right'}-2 h-6 w-6 p-1 text-flash-gray-200 pointer-events-none bg-flash-gray-800 bg-opacity-70 rounded-full" class:locked>
            {#if locked}
                <FaLock></FaLock>
            {:else}
                <FaUnlock></FaUnlock>
            {/if}
        </div>
    {/if}
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
        @apply text-flash-gray-100;
    }

    path.data {
        @apply text-flash-pink stroke-current;
        stroke-linejoin: round;
        stroke-linecap: round;
        stroke-width: 4px;
        fill: none;

        &.mu {
            stroke-width: 2px;
        }

        &.bound {
            &.lower {
                @apply text-flash-pink;
            }
            &.upper {
                @apply text-flash-pink;
            }
            opacity: 0.6;
            stroke-width: 2px;
        }
    }

    path.data-fill {
        stroke: none;
        fill-opacity: 0.5;
    }
</style>
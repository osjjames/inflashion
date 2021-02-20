<script lang="ts">
    import {Chart, Box, Grid, Svg, SvgLine} from '@sveltejs/pancake';
    import gaussian from 'gaussian';
    import SvgSmoothLine from "./pancakeExtensions/SvgSmoothLine.svelte";
    import pdf from 'distributions-truncated-normal-pdf';
    import {randomTrunc} from "../../utils/probability";

    const xMax = 200;
    const yMax = 1;

    export let mu: number = 0.5;
    export let sigma: number = 0.05;
    let gaussianPoints = [];

    const chartPointsFromSamples = (mu: number, sigma: number, samples: number = 1000): Array<{x: number, y: number}> => {
        const data = [];
        for (let i = 0; i < samples; i++) {
            data.push(randomTrunc({range: [0, 1], mu, sigma}));
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
        const xValues = Array.from(Array(xMax + 1).keys()).map(n => n/xMax);
        const gaussianValues: Number[] = pdf(xValues, options);
        const probMax: Number = pdf(mu, options);
        return gaussianValues.map((value, i) => ({
            x: i,
            y: value * (yMax / probMax)
        }));
    }

    $: {
        gaussianPoints = chartPointsFromPdf(mu, sigma);
    }
</script>

<div class="h-full p-2">
    <div class="h-full border-2 border-b-0 border-flash-gray-600 rounded-t-2xl pb-0.5 pt-2 overflow-hidden">
        <Chart x1={0} x2={xMax} y1={0} y2={yMax}>
            <Svg>
                <SvgSmoothLine data={gaussianPoints} let:d>
                    <path class="data" {d}/>
                </SvgSmoothLine>
            </Svg>
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

    path.data {
        @apply text-flash-pink stroke-current;
        stroke-linejoin: round;
        stroke-linecap: round;
        stroke-width: 4px;
        fill: none;
    }
</style>
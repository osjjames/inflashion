<script lang="ts">
    import {Chart, Grid, Svg, SvgLine, Point, Quadtree} from '@sveltejs/pancake';
    import {simulation} from "../store/simulation";
    import SvgSmoothLine from "./charts/pancakeExtensions/SvgSmoothLine.svelte";
    import type {Protocol} from "../utils/protocol";

    const numberWithSpaces = (x: number | string) => {
        let parts = x.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        return parts.join(".");
    }
    let supplyPoints: { x: number, y: number}[] = [];
    let stakedPoints: { x: number, y: number}[] = [];
    let zeroPoints: {x: number, y: number}[] = [];
    let xMin = 0;
    let xMax = supplyPoints.length;
    let yMin: number = 0;
    let yMax: number = -Infinity;
    let closest = undefined;

    $: sim = $simulation;

    // let yMin: number = sim.protocol.totalSupply;
    // let yMax: number = sim.protocol.totalSupply;
    // let supplyPoints: {x: number, y: number}[] = [{
    //     x: 0, y: sim.protocol.totalSupply
    // }];

    const verticalLine = (day: number): Array<{x: number, y: number}> => {
        return [{x: day, y: 0}, {x: day, y: yMax}];
    }

    $: {
        // if (sim.protocol.totalSupply < yMin) yMin = sim.protocol.totalSupply;
        if (sim.protocol.totalSupply > yMax) yMax = sim.protocol.totalSupply;
        supplyPoints = [...supplyPoints, {
            x: sim.today,
            y: sim.protocol.totalSupply
        }];
        stakedPoints = [...stakedPoints, {
            x: sim.today,
            y: sim.protocol.totalStaked
        }];
        zeroPoints = [...zeroPoints, {
            x: sim.today,
            y: 0
        }];
        xMax = sim.today;
    }
</script>

<div class="w-full h-96 p-12">
    <Chart x1={xMin} x2={xMax} y1={yMin} y2={yMax}>
        <Grid horizontal count={5} let:value>
            <div class="grid-line horizontal"><span>{value}</span></div>
        </Grid>

        <Grid vertical count={5} let:value>
            <span class="x-label">{value}</span>
        </Grid>

        {#if supplyPoints.length > 1}
        <Svg>
            <SvgLine data={supplyPoints} let:d>
                <path class="data" {d}></path>
            </SvgLine>
        </Svg>
        {/if}

        {#if stakedPoints.length > 1}
            <Svg>
                <SvgLine data={stakedPoints} let:d>
                    <path class="data" {d}></path>
                </SvgLine>
            </Svg>
        {/if}

<!--        <Svg>-->
<!--            {#each filtered as country}-->
<!--                <SvgLine data={country.data} let:d>-->
<!--                    <path class="data" {d}></path>-->
<!--                </SvgLine>-->
<!--            {/each}-->

<!--            {#if closest}-->
<!--                <SvgLine data={closest.country.data} let:d>-->
<!--                    <path class="highlight" {d}></path>-->
<!--                </SvgLine>-->
<!--            {/if}-->
<!--        </Svg>-->

        {#if closest && supplyPoints.length > 1}
            <Svg>
                <SvgLine data={verticalLine(closest.x)} let:d>
                    <path class="data vertical" {d}></path>
                </SvgLine>
            </Svg>
            <Point x={closest.x} y={supplyPoints[closest.x - 1].y}>
                <span class="annotation-point"></span>
                <div class="annotation" style="transform: translate(-{100 * ((closest.x - xMax) / (xMax - xMin))}%,0)">
                    <strong>{numberWithSpaces(supplyPoints[closest.x - 1].y.toFixed(0))}</strong> $FLASH
                </div>
            </Point>
            <Point x={closest.x} y={stakedPoints[closest.x - 1].y}>
                <span class="annotation-point"></span>
                <div class="annotation" style="transform: translate(-{100 * ((closest.x - xMax) / (xMax - xMin))}%,0)">
                    <strong>{numberWithSpaces(stakedPoints[closest.x - 1].y)}</strong> $FLASH
                </div>
            </Point>
        {/if}

        <Quadtree data={zeroPoints} bind:closest/>
    </Chart>
</div>

<style>
    .chart {
        margin: 0 0 36px 0;
    }

    input {
        font-size: inherit;
        font-family: inherit;
        padding: 0.5em;
    }

    .grid-line {
        position: relative;
        display: block;
    }

    .grid-line.horizontal {
        width: calc(100% + 2em);
        left: -2em;
        border-bottom: 1px dashed #555;
    }

    .grid-line span {
        position: absolute;
        left: 0;
        bottom: 2px;
        font-size: 14px;
        color: #888;
    }

    .x-label {
        position: absolute;
        width: 4em;
        left: -2em;
        bottom: -22px;
        font-family: sans-serif;
        font-size: 14px;
        color: #888;
        text-align: center;
    }

    path.data {
        stroke: white;
        stroke-linejoin: round;
        stroke-linecap: round;
        stroke-width: 2px;
        fill: none;

        &.vertical {
            stroke-width: 1px;
            stroke: #555;
        }
    }

    .highlight {
        stroke: #ff3e00;
        fill: none;
        stroke-width: 2;
    }

    .annotation {
        position: absolute;
        white-space: nowrap;
        bottom: 1em;
        line-height: 1.2;
        background-color: black;
        padding: 0.2em 0.4em;
        border-radius: 2px;
    }

    .annotation-point {
        position: absolute;
        width: 10px;
        height: 10px;
        @apply bg-white;
        border-radius: 50%;
        transform: translate(-50%,-50%);
    }

    .annotation strong {
        display: block;
        font-size: 1rem;
    }

    .annotation span {
        display: block;
        font-size: 14px;
    }
</style>
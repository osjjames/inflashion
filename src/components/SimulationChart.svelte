<script lang="ts">
    import {Chart, Grid, Svg, SvgLine, Point, Quadtree} from '@sveltejs/pancake';
    import {simulation} from "../store/simulation";
    import SvgSmoothLine from "./charts/pancakeExtensions/SvgSmoothLine.svelte";
    import type {Protocol} from "../utils/protocol";
    import {precision, roundToInt} from "../utils/protocol";
    import {probRound} from "../utils/probability";
    import {numberWithSpaces} from "../utils/format";

    let supplyPoints: { x: number, y: number}[] = [];
    let stakedPoints: { x: number, y: number}[] = [];
    let matchedPoints: { x: number, y: number}[] = [];
    let zeroPoints: {x: number, y: number}[] = [];
    let xMin = 0;
    let xMax = supplyPoints.length;
    let yMin: number = 0;
    let yMax: number = -Infinity;
    let closest = undefined;
    let annotationOffset: {x: number, y: number} = {x: 0, y: 0};

    let window = 1000;

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
        if (sim.protocol.totalSupply > yMax*precision) yMax = probRound(sim.protocol.totalSupply / precision, 1, 'CEIL');
        supplyPoints = [...supplyPoints, {
            x: sim.today,
            y: sim.protocol.totalSupply / precision
        }];
        stakedPoints = [...stakedPoints, {
            x: sim.today,
            y: sim.protocol.totalStaked / precision
        }];
        matchedPoints = [...matchedPoints, {
            x: sim.today,
            y: sim.protocol.totalMatched / precision
        }];
        zeroPoints = [...zeroPoints, {
            x: sim.today,
            y: 0
        }];
        xMax = sim.today;
        xMin = Math.max(sim.today-window, 0);
    }
    $: {
        if (closest) {
            let xPercent = -(100 * ((xMax - closest.x) / (xMax - xMin))) + 100;
            annotationOffset = {
                x: xPercent,
                y: 0
            };
        } else {
            annotationOffset = {x: 0, y: 0};
        }
    }
</script>

<div class="w-full h-96 p-12">
    <Chart x1={Math.max(xMin, xMax - window)} x2={xMax} y1={yMin} y2={yMax} class="relative">
        <Grid horizontal count={5} let:value>
            <div class="grid-line horizontal"><span>{value}</span></div>
        </Grid>

        <Grid vertical count={5} let:value>
            <span class="x-label">{value}</span>
        </Grid>

        {#if supplyPoints.length > 1}
        <Svg>
            <SvgLine data={supplyPoints.slice(0-window)} let:d>
                <path class="data stroke-palette-1" {d}></path>
            </SvgLine>
        </Svg>
        {/if}
        {#if stakedPoints.length > 1}
            <Svg>
                <SvgLine data={stakedPoints.slice(0-window)} let:d>
                    <path class="data stroke-palette-2" {d}></path>
                </SvgLine>
            </Svg>
        {/if}
        {#if matchedPoints.length > 1}
            <Svg>
                <SvgLine data={matchedPoints.slice(0-window)} let:d>
                    <path class="data stroke-palette-3" {d}></path>
                </SvgLine>
            </Svg>
        {/if}

        {#if closest && supplyPoints.length > 1}
            <Svg>
                <SvgLine data={verticalLine(closest.x)} let:d>
                    <path class="data vertical" {d}></path>
                </SvgLine>
            </Svg>
            <Point x={closest.x} y={supplyPoints[closest.x - 1].y}>
                <span class="annotation-point bg-flash-palette-1 shadow-palette-1"></span>
            </Point>
            <Point x={closest.x} y={stakedPoints[closest.x - 1].y}>
                <span class="annotation-point bg-flash-palette-2 shadow-palette-2"></span>
            </Point>
            <Point x={closest.x} y={matchedPoints[closest.x - 1].y}>
                <span class="annotation-point bg-flash-palette-3 shadow-palette-3"></span>
            </Point>
            <div class="annotation bg-flash-gray-800 bg-opacity-80 w-80 h-16 flex absolute whitespace-nowrap bottom-4 leading-tight rounded-lg box-border"
                 style="left: max(calc({annotationOffset.x}% - 20rem), 1rem); top: calc(-4rem - 0.5rem);">
                <div class="mr-3">
                    Total Supply:<br/>
                    Total Staked:<br/>
                    Total Matched:
                </div>
                <div class="flex justify-between w-full">
                    <div>
                        <b class="text-flash-palette-1">{numberWithSpaces(supplyPoints[closest.x - 1].y.toFixed(0))}</b>
                        <br/>
                        <b class="text-flash-palette-2">{numberWithSpaces(stakedPoints[closest.x - 1].y.toFixed(0))}</b>
                        <br/>
                        <b class="text-flash-palette-3">{numberWithSpaces(matchedPoints[closest.x - 1].y.toFixed(0))}</b>
                    </div>
                    <div>
                        $FLASH<br/>
                        $FLASH<br/>
                        $FLASH
                    </div>
                </div>
            </div>
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
        stroke-linejoin: round;
        stroke-linecap: round;
        stroke-width: 3px;
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
        padding: 0.2em 0.4em;
    }

    .annotation-point {
        position: absolute;
        width: 10px;
        height: 10px;
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
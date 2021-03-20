<script lang="ts">
    import {Chart, Grid, Quadtree} from '@sveltejs/pancake';
    import {simulation} from "../../store/simulation";
    import {precision} from "../../utils/protocol";
    import {probRound} from "../../utils/probability";
    import {numberWithSpaces, abbreviateNumber} from "../../utils/format";
    import ChartPoint from "./ChartPoint.svelte";
    import ChartLine from "./ChartLine.svelte";

    let supplyPoints: { x: number, y: number }[] = [];
    let stakedPoints: { x: number, y: number }[] = [];
    let matchedPoints: { x: number, y: number }[] = [];
    let zeroPoints: { x: number, y: number }[] = [];
    let xMin = 0;
    let xMax = supplyPoints.length;
    let yMin: number = 0;
    let yMax: number = -Infinity;
    let closest = undefined;
    let annotationOffset: { x: number, y: number } = {x: 0, y: 0};

    let window = 365;

    $: sim = $simulation;

    // let yMin: number = sim.protocol.totalSupply;
    // let yMax: number = sim.protocol.totalSupply;
    // let supplyPoints: {x: number, y: number}[] = [{
    //     x: 0, y: sim.protocol.totalSupply
    // }];

    const verticalLine = (day: number): Array<{ x: number, y: number }> => {
        return [{x: day, y: 0}, {x: day, y: yMax}];
    }

    $: {
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
        xMin = Math.max(sim.today - window, 0);
        yMax = yMax = probRound(Math.max(...(supplyPoints.slice(0-window).map(p=>p.y))), 1, 'CEIL');
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
    <Chart x1={Math.max(xMin, xMax - window)} x2={xMax} y1={yMin} y2={yMax} class="relative cursor-crosshair">
        <Grid horizontal count={5} let:value>
            <div class="relative block border-b text-right border-flash-gray-300 opacity-80 border-dashed w-full">
                <span class="absolute bottom-0.25 -left-24 pr-2 w-24 transform -translate-y-3">{abbreviateNumber(value)}</span>
            </div>
        </Grid>

        <Grid vertical count={5} let:value>
            <span class="x-label">{numberWithSpaces(value)}</span>
        </Grid>

        {#if supplyPoints.length > 1}
            <ChartLine data={supplyPoints.slice(0-window)} pathClass="stroke-palette-1"/>
        {/if}
        {#if stakedPoints.length > 1}
            <ChartLine data={stakedPoints.slice(0-window)} pathClass="stroke-palette-2"/>
        {/if}
        {#if matchedPoints.length > 1}
            <ChartLine data={matchedPoints.slice(0-window)} pathClass="stroke-palette-3"/>
        {/if}

        {#if closest && supplyPoints.length > 1}
            <ChartLine data={verticalLine(closest.x)} pathClass="stroke-2 stroke-gray"/>
            <ChartPoint x={closest.x} y={supplyPoints[closest.x - 1].y} innerClass="bg-flash-palette-1 shadow-palette-1"/>
            <ChartPoint x={closest.x} y={stakedPoints[closest.x - 1].y} innerClass="bg-flash-palette-2 shadow-palette-2"/>
            <ChartPoint x={closest.x} y={matchedPoints[closest.x - 1].y}  innerClass="bg-flash-palette-3 shadow-palette-3"/>
            <div class="annotation bg-flash-gray-800 bg-opacity-80 w-80 h-16 flex absolute whitespace-nowrap bottom-4 leading-tight rounded-lg p-4"
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

        <Quadtree data={zeroPoints.slice(0-window)} bind:closest/>
    </Chart>
</div>

<style>
    .grid-line span {
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

    .annotation {
        padding: 0.2em 0.4em;
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
<script lang="ts">
    import {Chart, Grid, Quadtree} from '@sveltejs/pancake';
    import {simulation} from "../../store/simulation";
    import {precision} from "../../utils/protocol";
    import {probRound} from "../../utils/probability";
    import {numberWithSpaces, abbreviateNumber} from "../../utils/format";
    import ChartPoint from "./ChartPoint.svelte";
    import ChartLine from "./ChartLine.svelte";
    import ButtonSmall from "../input/ButtonSmall.svelte";

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

    let windowLength: WindowLength = 'year';

    $: sim = $simulation;

    // let yMin: number = sim.protocol.totalSupply;
    // let yMax: number = sim.protocol.totalSupply;
    // let supplyPoints: {x: number, y: number}[] = [{
    //     x: 0, y: sim.protocol.totalSupply
    // }];

    type WindowLength = 'week' | 'month' | 'year' | '5year' | 'all';
    const getWindow = (length: WindowLength): number => {
        switch (length) {
            case 'week': return 7;
            case 'month': return 30;
            case 'year': return 365;
            case '5year': return 1825;
            case 'all': return supplyPoints.length;
        }
    }

    const verticalLine = (day: number): Array<{ x: number, y: number }> => {
        return [{x: day, y: 0}, {x: day, y: yMax}];
    }

    const sliceToWindow = (array: any[]) => {
        if (windowLength === 'all') return array;
        return array.slice(0 - getWindow(windowLength));
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
        xMin = Math.max(sim.today - getWindow(windowLength), 0);
        yMax = yMax = probRound(Math.max(...(sliceToWindow(supplyPoints).map(p => p.y))), 1, 'CEIL');
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

<div class="w-full h-96 p-12 pt-0 flex flex-col">
    <div class="flex justify-end">
        <div class="flex">
            <ButtonSmall onClick={() => windowLength = 'week'} selected={windowLength === 'week'}>1W</ButtonSmall>
            <ButtonSmall onClick={() => windowLength = 'month'} selected={windowLength === 'month'}>1M</ButtonSmall>
            <ButtonSmall onClick={() => windowLength = 'year'} selected={windowLength === 'year'}>1Y</ButtonSmall>
            <ButtonSmall onClick={() => windowLength = '5year'} selected={windowLength === '5year'}>5Y</ButtonSmall>
            <ButtonSmall onClick={() => windowLength = 'all'} selected={windowLength === 'all'}>ALL</ButtonSmall>
        </div>
    </div>
    <Chart x1={xMin} x2={xMax} y1={yMin} y2={yMax} class="relative cursor-crosshair">
        <Grid horizontal count={5} let:value>
            <div class="relative block border-b text-right border-flash-gray-300 opacity-80 border-dashed w-full">
                <span class="absolute bottom-0.25 -left-24 pr-2 w-24 transform -translate-y-3">{abbreviateNumber(value)}</span>
            </div>
        </Grid>

        <Grid vertical count={5} let:value>
            <span class="x-label">{numberWithSpaces(value)}</span>
        </Grid>

        {#if supplyPoints.length > 1}
            <ChartLine data={sliceToWindow(supplyPoints)} pathClass="stroke-palette-1"/>
        {/if}
        {#if stakedPoints.length > 1}
            <ChartLine data={sliceToWindow(stakedPoints)} pathClass="stroke-palette-2"/>
        {/if}
        {#if matchedPoints.length > 1}
            <ChartLine data={sliceToWindow(matchedPoints)} pathClass="stroke-palette-3"/>
        {/if}

        {#if closest && supplyPoints.length > 1}
            <ChartLine data={verticalLine(closest.x)} pathClass="stroke-2 stroke-gray"/>
            <ChartPoint x={closest.x} y={supplyPoints[closest.x - 1].y} innerClass="bg-flash-palette-1 shadow-palette-1"/>
            <ChartPoint x={closest.x} y={stakedPoints[closest.x - 1].y} innerClass="bg-flash-palette-2 shadow-palette-2"/>
            <ChartPoint x={closest.x} y={matchedPoints[closest.x - 1].y}  innerClass="bg-flash-palette-3 shadow-palette-3"/>
            <div class="annotation bg-flash-gray-600 bg-opacity-80 w-80 h-fit flex absolute whitespace-nowrap bottom-4 leading-tight rounded-lg p-2"
                 style="left: max(calc({annotationOffset.x}% - 20rem), 1rem); top: calc(-4rem - 1rem);">
                <div class="mr-3">
                    Total Supply:<br/>
                    Total Staked:<br/>
                    Total Matched:
                </div>
                <div class="flex justify-between w-full">
                    <div>
                        <b class="text-flash-palette-1 font-semibold">{numberWithSpaces(supplyPoints[closest.x - 1].y.toFixed(0))}</b>
                        <br/>
                        <b class="text-flash-palette-2 font-semibold">{numberWithSpaces(stakedPoints[closest.x - 1].y.toFixed(0))}</b>
                        <br/>
                        <b class="text-flash-palette-3 font-semibold">{numberWithSpaces(matchedPoints[closest.x - 1].y.toFixed(0))}</b>
                    </div>
                    <div>
                        $FLASH<br/>
                        $FLASH<br/>
                        $FLASH
                    </div>
                </div>
            </div>
        {/if}

        <Quadtree data={sliceToWindow(zeroPoints)} bind:closest/>
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

    .annotation strong {
        display: block;
        font-size: 1rem;
    }

    .annotation span {
        display: block;
        font-size: 14px;
    }
</style>
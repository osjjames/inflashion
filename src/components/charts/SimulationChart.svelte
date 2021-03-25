<script lang="ts">
    import {Chart, Grid, Quadtree} from '@sveltejs/pancake';
    import {simulation} from "../../store/simulation";
    import {precision} from "../../utils/protocol";
    import type {Day} from "../../utils/protocol";
    import {probRound} from "../../utils/probability";
    import {numberWithSpaces, abbreviateNumber} from "../../utils/format";
    import ChartPoint from "./ChartPoint.svelte";
    import ChartLine from "./ChartLine.svelte";
    import ButtonSmall from "../input/ButtonSmall.svelte";
    import type {WindowLength, Point2} from "../../utils/chart";
    import {getWindow, LineData} from "../../utils/chart";

    let windowLength: WindowLength = 'year';
    type LineNames = 'supply' | 'staked' | 'matched';
    type LinesType<T> = {
        [name in LineNames]: T
    }

    let lines: LinesType<LineData> = {
        supply: new LineData({name: 'Total Supply'}),
        staked: new LineData({name: 'Total Staked'}),
        matched: new LineData({name: 'Total Matched'})
    };
    let slicedLines: LinesType<Point2[]> = {
        supply: [],
        staked: [],
        matched: []
    };
    let zeroSliced = [];

    $: sim = $simulation;

    let xMin = 0;
    let xMax = 1;
    let yMin: number = 0;
    let yMax: number = -Infinity;
    let closest = undefined;
    let annotationOffset: Point2;

    const verticalLine = (day: number): Array<Point2> => {
        return [{x: day, y: yMin}, {x: day, y: yMax}];
    }

    const updateChartBounds = (linesHidden: LinesType<boolean>) => {
        xMax = sim.today;
        xMin = Math.max(sim.today - getWindow(windowLength, sim.today), 0) + 1;

        const allVisibleY =
            Object.keys(lines)
            .filter(lineName => !lines[lineName].hidden)   // Filter out hidden lines
            .map(lineName => slicedLines[lineName]) // Slice all to the current window
            .reduce((acc, val) => acc.concat(val), []) // Flatten into single array of all points
            .map(point => point.y); // Extract y values from points

        yMin = probRound(Math.min(...allVisibleY), 1, 'FLOOR');
        yMax = probRound(Math.max(...allVisibleY), 1, 'CEIL');
    }

    const updateChartWithNewDay = (day: Day) => {
        lines.supply.addPoint({
            x: day,
            y: sim.protocol.totalSupply / precision
        });
        lines.staked.addPoint({
            x: day,
            y: sim.protocol.totalStaked / precision
        });
        lines.matched.addPoint({
            x: day,
            y: sim.protocol.totalMatched / precision
        });

        updateSlicedLines();
        updateChartBounds(linesHidden);
    }
    const updateSlicedLines = () => {
        slicedLines.supply = lines.supply.sliceToWindow(windowLength);
        slicedLines.staked = lines.staked.sliceToWindow(windowLength);
        slicedLines.matched = lines.matched.sliceToWindow(windowLength);
        zeroSliced = slicedLines.supply.map(p => ({x: p.x, y: 0}));
    }

    const updateChartWithNewWindow = (windowLength: WindowLength) => {
        updateSlicedLines();
        updateChartBounds(linesHidden);
    }

    $: linesHidden = {
        supply: lines.supply.hidden,
        staked: lines.staked.hidden,
        matched: lines.matched.hidden
    }

    $: updateChartWithNewDay(sim.today);
    $: updateChartWithNewWindow(windowLength);
    $: updateChartBounds(linesHidden);
    $: if (closest) {
        let xPercent = -(100 * ((xMax - closest.x) / (xMax - xMin))) + 100;
        annotationOffset = {
            x: xPercent,
            y: 0
        };
    } else {
        annotationOffset = {x: 0, y: 0};
    }
</script>

<div class="w-full h-96 p-12 pt-0 flex flex-col">
    <div class="flex justify-between mb-4">
        <div class="flex">
            <ButtonSmall onClick={() => lines.supply.hidden = !lines.supply.hidden} selected={!lines.supply.hidden}>{lines.supply.name}</ButtonSmall>
            <ButtonSmall onClick={() => lines.staked.hidden = !lines.staked.hidden} selected={!lines.staked.hidden}>{lines.staked.name}</ButtonSmall>
            <ButtonSmall onClick={() => lines.matched.hidden = !lines.matched.hidden} selected={!lines.matched.hidden}>{lines.matched.name}</ButtonSmall>
        </div>
        <div class="flex">
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

        {#if slicedLines.supply.length > 1 && !linesHidden.supply}
            <ChartLine data={slicedLines.supply} pathClass="stroke-palette-1"/>
        {/if}
        {#if slicedLines.staked.length > 1 && !linesHidden.staked}
            <ChartLine data={slicedLines.staked} pathClass="stroke-palette-2"/>
        {/if}
        {#if slicedLines.matched.length > 1 && !linesHidden.matched}
            <ChartLine data={slicedLines.matched} pathClass="stroke-palette-3"/>
        {/if}

        {#if closest && sim.today > 1}
            <ChartLine data={verticalLine(closest.x)} pathClass="stroke-2 stroke-gray"/>
            {#if !linesHidden.supply}<ChartPoint x={closest.x} y={lines.supply.all[closest.x - 1].y} innerClass="bg-flash-palette-1 shadow-palette-1"/>{/if}
            {#if !linesHidden.staked}<ChartPoint x={closest.x} y={lines.staked.all[closest.x - 1].y} innerClass="bg-flash-palette-2 shadow-palette-2"/>{/if}
            {#if !linesHidden.matched}<ChartPoint x={closest.x} y={lines.matched.all[closest.x - 1].y}  innerClass="bg-flash-palette-3 shadow-palette-3"/>{/if}
            <div class="annotation bg-flash-gray-600 bg-opacity-80 w-80 h-fit flex absolute whitespace-nowrap bottom-4 leading-tight rounded-lg p-2"
                 style="left: max(calc({annotationOffset.x}% - 20rem), 1rem); top: calc(-4rem - 1rem);">
                <div class="mr-3">
                    {#each Object.keys(lines) as lineName (lineName)}
                        {#if !linesHidden[lineName]}{lines[lineName].name}:<br/>{/if}
                    {/each}
                </div>
                <div class="flex justify-between w-full">
                    <div>
                        {#each Object.keys(lines) as lineName (lineName)}
                        {#if !linesHidden.supply}<b class="text-flash-palette-1 font-semibold">{numberWithSpaces(lines.supply.all[closest.x - 1].y.toFixed(0))}</b>
                        <br/>{/if}
                        {#if !linesHidden.staked}<b class="text-flash-palette-2 font-semibold">{numberWithSpaces(lines.staked.all[closest.x - 1].y.toFixed(0))}</b>
                        <br/>{/if}
                        {#if !linesHidden.matched}<b class="text-flash-palette-3 font-semibold">{numberWithSpaces(lines.matched.all[closest.x - 1].y.toFixed(0))}</b>{/if}
                    </div>
                    <div>
                        {#if !linesHidden.supply}$FLASH<br/>{/if}
                        {#if !linesHidden.staked}$FLASH<br/>{/if}
                        {#if !linesHidden.matched}$FLASH{/if}
                    </div>
                </div>
            </div>
        {/if}

        <Quadtree data={zeroSliced} bind:closest/>
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
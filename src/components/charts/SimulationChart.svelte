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
    import ChartToggle from "../input/ChartToggle.svelte";
    import { fade } from 'svelte/transition';
    import {tweened} from "svelte/motion";
    import {cubicInOut} from "svelte/easing";
    import {speed} from "../../store/time";

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

    const xMin = tweened<number>(0, {
        duration: 50
    });
    const xMax = tweened<number>(1, {
        duration: 50
    });
    const yMin = tweened<number>(0, {
        duration: 100,
        easing: cubicInOut
    });
    const yMax = tweened<number>(-Infinity, {
        duration: 100,
        easing: cubicInOut
    });
    let closest = undefined;
    let annotationOffset: Point2;

    const verticalLine = (day: number): Array<Point2> => {
        return [{x: day, y: $yMin as number}, {x: day, y: $yMax as number}];
    }

    const getTransitionSpeed = (speed: number) => {
        const interval = Math.floor(1000/speed);
        return interval < 50 ? 0 : Math.floor(interval / 2);
    }

    const updateChartBounds = (linesHidden: LinesType<boolean>) => {
        const interval = Math.floor(1000/$speed);
        const xTransitionSpeed = $speed > 20 ? 0 : Math.floor(interval / 2);
        const yTransitionSpeed = $speed < 10 ? 100 : Math.floor((interval/3) + (100 * 2/3));

        xMax.update(n => sim.today, {duration: xTransitionSpeed});
        xMin.update(n => Math.max(sim.today - getWindow(windowLength, sim.today), 0) + 1, {duration: xTransitionSpeed});

        const allVisibleY =
            Object.keys(lines)
                .filter(lineName => !lines[lineName].hidden)   // Filter out hidden lines
                .map(lineName => slicedLines[lineName]) // Slice all to the current window
                .reduce((acc, val) => acc.concat(val), []) // Flatten into single array of all points
                .map(point => point.y); // Extract y values from points

        yMin.update(n => probRound(Math.min(...allVisibleY), 1, 'FLOOR'), {duration: yTransitionSpeed});
        yMax.update(n => probRound(Math.max(...allVisibleY), 1, 'CEIL'), {duration: yTransitionSpeed});
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
        let xPercent = -(100 * (($xMax - closest.x) / ($xMax - $xMin))) + 100;
        annotationOffset = {
            x: xPercent,
            y: 0
        };
    } else {
        annotationOffset = {x: 0, y: 0};
    }
</script>

<div class="w-full h-96 p-12 pt-0 flex flex-col">
    <div class="flex flex-col items-end md:items-center md:flex-row md:justify-between mb-4">
        <div class="flex">
            {#each Object.keys(lines) as lineName, index (lineName)}
                <ChartToggle
                        onClick={() => lines[lineName].hidden = !lines[lineName].hidden}
                        active={!lines[lineName].hidden}
                        activeClass="bg-flash-palette-{index+1} shadow-palette-{index+1}">
                    {lines[lineName].name}
                </ChartToggle>
            {/each}
        </div>
        <div class="flex">
            <ButtonSmall onClick={() => windowLength = 'month'} selected={windowLength === 'month'}>1M</ButtonSmall>
            <ButtonSmall onClick={() => windowLength = 'year'} selected={windowLength === 'year'}>1Y</ButtonSmall>
            <ButtonSmall onClick={() => windowLength = '5year'} selected={windowLength === '5year'}>5Y</ButtonSmall>
            <ButtonSmall onClick={() => windowLength = 'all'} selected={windowLength === 'all'}>ALL</ButtonSmall>
        </div>
    </div>
    <div class="relative cursor-crosshair w-full h-full">
    <Chart x1={$xMin} x2={$xMax} y1={$yMin} y2={$yMax}>
        <Grid horizontal count={5} let:value>
            <div class="relative block border-b text-right border-flash-gray-300 opacity-80 border-dashed w-full">
                <span class="absolute bottom-0.25 -left-24 pr-2 w-24 transform -translate-y-3 text-sm text-flash-gray-100">{abbreviateNumber(value)}</span>
            </div>
        </Grid>

        <Grid vertical count={5} let:value>
            <span class="x-label text-sm text-flash-gray-100">{numberWithSpaces(value)}</span>
        </Grid>

        <div class="line-chart w-full h-full">
            {#each Object.keys(lines) as lineName, index (lineName)}
                {#if slicedLines[lineName].length > 1 && !linesHidden[lineName]}
                    <ChartLine data={slicedLines[lineName]} pathClass="stroke-3 stroke-palette-{index+1}"/>
                {/if}
            {/each}
            {#if closest && sim.today > 1}
                <ChartLine data={verticalLine(closest.x)} pathClass="stroke-2 stroke-gray"/>
            {/if}
        </div>

        {#if closest && sim.today > 1}
            {#each Object.keys(lines) as lineName, index (lineName)}
                {#if !linesHidden[lineName]}
                    <ChartPoint x={closest.x} y={lines[lineName].all[closest.x - 1].y} innerClass="bg-flash-palette-{index+1} shadow-palette-{index+1}"/>
                {/if}
            {/each}
            <div class="annotation bg-flash-gray-600 bg-opacity-80 w-80 h-fit flex-col absolute whitespace-nowrap bottom-4 leading-tight rounded-lg p-2"
                 style="left: max(calc({annotationOffset.x}% - 20rem), 0rem); top: calc(0 - 1rem);">
                <div class="w-full font-semibold">Day {closest.x}</div>
                <div class="flex">
                    <div class="mr-3">
                        {#each Object.keys(lines) as lineName (lineName)}
                            {#if !linesHidden[lineName]}{lines[lineName].name}:<br/>{/if}
                        {/each}
                    </div>
                    <div class="flex justify-between w-full">
                        <div>
                            {#each Object.keys(lines) as lineName, index (lineName)}
                                {#if !linesHidden[lineName]}
                                    <b class="text-flash-palette-{index+1} font-semibold">{numberWithSpaces(lines[lineName].all[closest.x - 1].y.toFixed(0))}</b>
                                    <br/>
                                {/if}
                            {/each}
                        </div>
                        <div>
                            {#each Object.keys(lines) as lineName (lineName)}
                                {#if !linesHidden[lineName]}$FLASH<br/>{/if}
                            {/each}
                        </div>
                    </div>
                </div>
            </div>
        {/if}

        <Quadtree data={zeroSliced} bind:closest/>
    </Chart>
    </div>
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

    .line-chart {
        clip-path: polygon(0 -1rem, 100% -1rem, 100% calc(100% + 0.25rem), 0 calc(100% + 0.25rem));
    }
</style>
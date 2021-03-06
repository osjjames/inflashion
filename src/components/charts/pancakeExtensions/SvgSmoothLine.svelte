

<script lang="ts">
    import { getChartContext } from '@sveltejs/pancake/components/Chart.svelte';
    import type {Bounds} from "../../../utils/probability";

    const default_x = (d, i = undefined) => d.x;
    const default_y = (d, i = undefined) => d.y;
    const { x_scale, y_scale } = getChartContext();

    export let data;
    export let bounds: Bounds | null;
    export let xMax: number;
    export let x = default_x;
    export let y = default_y;

    const line = (pointA, pointB) => {
        const lengthX = pointB.x - pointA.x
        const lengthY = pointB.y - pointA.y
        return {
            length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
            angle: Math.atan2(lengthY, lengthX)
        }
    }

    const controlPoint = (current, previous, next, reverse = false) => {
        // When 'current' is the first or last point of the array
        // 'previous' or 'next' don't exist.
        // Replace with 'current'
        const p = previous || current
        const n = next || current
        // The smoothing ratio
        const smoothing = 0.2
        // Properties of the opposed-line
        const o = line(p, n)
        // If is end-control-point, add PI to the angle to go backward
        const angle = o.angle + (reverse ? Math.PI : 0)
        const length = o.length * smoothing
        // The control point position is relative to the current point
        const x = current.x + Math.cos(angle) * length
        const y = current.y + Math.sin(angle) * length
        return {x, y};
    }

    const bezierCommand = (point, i, data) => {
        // start control point
        const cps = controlPoint(data[i - 1], data[i - 2], point)
        // end control point
        const cpe = controlPoint(point, data[i - 1], data[i + 1], true)
        return `C ${$x_scale(x(cps, i))},${$y_scale(y(cps, i))} ${$x_scale(x(cpe, i))},${$y_scale(y(cpe, i))} ${$x_scale(x(point, i))},${$y_scale(y(point, i))}`
    }

    const truncatedData = (data, bounds) => {
        const minSlice = bounds ? Math.floor(bounds.lower * (data.length)) : 0;
        const maxSlice = bounds ? Math.ceil(bounds.upper * (data.length)): data.length;
        return data.slice(minSlice, maxSlice);
    }

    const dataToPath = data => data.reduce((acc, point, i, a) => i === 0
        ? `M ${$x_scale(x(point, i))},${$y_scale(y(point, i))}`
        : `${acc} ${bezierCommand(point, i, a)}`
        , '');

    const fill = (data) => {
        // const maxY = Math.max(...data.map(d => d.y));
        const minY = 0;
        // const maxX = bounds ? (bounds.upper*xMax) : x(data[data.length-1]);
        // const minX = bounds ? (bounds.lower*xMax) : x(data[0]);
        const maxX = x(data[data.length-1]);
        const minX = x(data[0]);
        return `L ${$x_scale(maxX)},${$y_scale(minY)} L ${$x_scale(minX)},${$y_scale(minY)} Z`;
    }

    $: tData = truncatedData(data, bounds);
    $: d = dataToPath(data);
    $: dFill = `${dataToPath(tData)} ${fill(tData)}`;
</script>

<slot {d} {dFill}></slot>
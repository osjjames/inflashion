

<script>
    import { getChartContext } from '@sveltejs/pancake/components/Chart.svelte';

    const default_x = d => d.x;
    const default_y = d => d.y;
    const { x_scale, y_scale } = getChartContext();

    export let data;
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

    const controlPoint = (current, previous, next, reverse) => {
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


    let d;
    $: {
        d = data.reduce((acc, point, i, a) => i === 0
            // if first point
            ? `M ${$x_scale(x(point, i))},${$y_scale(y(point, i))}`
            // else
            : `${acc} ${bezierCommand(point, i, a)}`
            , '');
        // d = 'M' + data
        //     .map((d, i) => `${$x_scale(x(d, i))},${$y_scale(y(d, i))}`)
        //     .join('L');
    }
</script>

<slot {d}></slot>
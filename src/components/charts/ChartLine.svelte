<script lang="ts">
    import {Svg, SvgLine} from '@sveltejs/pancake';
    import type {Point2} from "../../utils/chart";
    import { fade } from 'svelte/transition';

    export let data: Point2[];
    export let pathClass: string = '';
</script>

<Svg>
    <SvgLine {data} let:d>
        <path class="{pathClass}" {d} in:fade="{{duration: 50}}" out:fade="{{duration: 50}}"></path>
    </SvgLine>
</Svg>

<style>
    path {
        stroke-linejoin: round;
        stroke-linecap: round;
        stroke-width: 3px;
        fill: none;
    }
</style>
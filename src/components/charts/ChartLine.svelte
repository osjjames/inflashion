<script lang="ts">
    import {Svg, SvgLine} from '@sveltejs/pancake';

    export let data: {x: number, y: number}[];
    export let pathClass: string = '';
</script>

<Svg>
    <SvgLine {data} let:d>
        <path class="{pathClass}" {d}></path>
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
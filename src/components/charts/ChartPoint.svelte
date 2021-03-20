<script lang="ts">
    import {Point} from '@sveltejs/pancake';

    export let x: number;
    export let y: number;
    export let innerClass: string = '';
</script>

<Point {x} {y}>
    <span class="absolute w-2.5 h-2.5 rounded-full transform -translate-x-1/2 -translate-y-1/2 {innerClass}"></span>
</Point>
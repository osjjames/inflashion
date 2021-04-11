<script lang="ts">
    type PieSegment = {
        value: number,
        name: string,
        color: string
    };
    type NormalisedPieSegment = {
        degrees: number,
        offset: number,
        name: string,
        color: string
    }
    export let segments: PieSegment[];
    let normalisedSegments: NormalisedPieSegment[];

    $: {
        let valuesTotal = segments.reduce((acc, curr ) => acc + curr.value, 0);
        normalisedSegments = [];
        let runningTotal = 0;
        for (let i = 0; i < segments.length; i++) {
            const normalisedSegment: NormalisedPieSegment = {
                degrees: Math.round((segments[i].value / valuesTotal) * 360),
                offset: runningTotal,
                name: segments[i].name,
                color: segments[i].color
            };
            normalisedSegments.push(normalisedSegment);
            runningTotal += normalisedSegment.degrees;
        }
    }
</script>
<div class="h-16 w-16 relative rounded-full overflow-hidden">
    {#each normalisedSegments as segment, index}
        <div class="pie-segment"
            style="--degrees: {segment.degrees}; --offset: {segment.offset}; --color: {segment.color}; --over50: {segment.degrees > 180 ? 1 : 0}">
        </div>
    {/each}
    <div class="bg-flash-gray-900 h-8 w-8 absolute rounded-full" style="top: 25%; left: 25%; z-index: 100"/>
</div>

<style>
    .pie-segment {
        --a: calc(var(--over50) * -100%);
        --b: calc((1 + var(--over50)) * 100%);
        @apply h-full w-full absolute;
        transform: translate(0, -50%) rotate(90deg) rotate(calc(var(--offset) * 1deg));
        transform-origin: 50% 100%;
        clip-path: polygon(var(--a) var(--a), var(--b) var(--a), var(--b) var(--b), var(--a) var(--b));
        z-index: calc(1 + var(--over50));
    }

    .pie-segment:before,
    .pie-segment:after {
        @apply h-full w-full absolute;
        background: var(--color);
        content: '';
    }

    .pie-segment:before {
        transform: translate(0, 100%) rotate(calc(var(--degrees) * 1deg));
        transform-origin: 50% 0%;
    }

    .pie-segment:after {
        opacity: var(--over50);
    }
</style>
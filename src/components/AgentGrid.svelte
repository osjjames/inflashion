<script lang="ts">
    import FaUserAlt from 'svelte-icons/fa/FaUserAlt.svelte';
    import Agent from "./Agent.svelte";
    import { scale, fly } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';

    export let population: number;
    export let maxPopulation: number;
    const peoplePerRow = 10;

    $: numberOfRows = Math.ceil(population / peoplePerRow);
    $: remainder = population % peoplePerRow;
</script>

<div class={`grid box-border`} style={`grid-template-columns: repeat(${peoplePerRow}, minmax(0, 1fr))`}>
    {#each Array(population) as _,i}
        <div transition:scale="{{duration: 200}}">
            <Agent/>
        </div>
    {/each}
    {#each Array(peoplePerRow-remainder) as _,k}
        <div></div>
    {/each}
</div>
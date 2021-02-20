<script lang="ts">
    import FaUserAlt from 'svelte-icons/fa/FaUserAlt.svelte';
    import Agent from "./Agent.svelte";

    export let population: number;
    export let maxPopulation: number;
    const peoplePerRow = 10;

    $: numberOfRows = Math.ceil(population / peoplePerRow);
    $: remainder = population % peoplePerRow;
</script>

<div class={`grid box-border`} style={`grid-template-columns: repeat(${peoplePerRow}, minmax(0, 1fr))`}>
    {#each Array(numberOfRows) as _, i}
        {#if i === numberOfRows - 1 && remainder !== 0}
            {#each Array(remainder) as _,j}
                <Agent/>
            {/each}
            {#each Array(peoplePerRow-remainder) as _,k}
                <div></div>
            {/each}
        {:else}
            {#each Array(peoplePerRow) as _,j}
                <Agent/>
            {/each}
        {/if}
    {/each}
</div>
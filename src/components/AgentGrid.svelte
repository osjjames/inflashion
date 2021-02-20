<script lang="ts">
    export let population: number;
    export let maxPopulation: number;
    const peoplePerRow = 20;

    $: numberOfRows = Math.ceil(population/peoplePerRow);
    $: remainder = population % peoplePerRow;
</script>

<div class="text-right">
    {#each Array(numberOfRows) as _, i}
        {#each Array(i === numberOfRows - 1 && remainder !== 0 ? remainder : peoplePerRow) as _,j}
            <span>o</span>
        {/each}
        <br/>
    {/each}
</div>
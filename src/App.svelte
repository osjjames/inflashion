<script lang="ts">
	import Slider from './components/input/Slider.svelte';
	export let population: number = 50;
	const maxPopulation = 500;
	const peoplePerRow = 20;

	$: numberOfRows = Math.ceil(population/peoplePerRow);
	$: remainder = population % peoplePerRow;
</script>

<main>
	<h1>Flash inflation</h1>
	<Slider min="0" max={maxPopulation} step="1" bind:value={population}></Slider>
	<div class="population-container">
		{#each Array(numberOfRows) as _, i}
			{#each Array(i === numberOfRows - 1 && remainder !== 0 ? remainder : peoplePerRow) as _,j}
				<span>o</span>
			{/each}
			<br/>
		{/each}
	</div>

</main>

<style global lang="postcss">
	/* only apply purgecss on utilities, per Tailwind docs */
	/* purgecss start ignore */
	@tailwind base;
	@tailwind components;
	/* purgecss end ignore */

	@tailwind utilities;

	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	.population-container {
		text-align: left;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
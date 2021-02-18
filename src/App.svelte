<script lang="ts">
	import Slider from './components/input/Slider.svelte';
	import AgentGrid from "./components/AgentGrid.svelte";
	import BellCurve from "./components/charts/BellCurve.svelte";
	import BellCurveController from "./components/charts/BellCurveController.svelte";

	let population: number = 50;
	const maxPopulation = 500;
</script>

<main class="h-screen w-screen">
	<h1>Flash inflation</h1>
	<Slider inputClass="w-96" min="0" max={maxPopulation} step="1" bind:value={population}></Slider>
	<AgentGrid {population} {maxPopulation}/>
	<BellCurveController/>
</main>

<style global lang="postcss">
	/* only apply purgecss on utilities, per Tailwind docs */
	/* purgecss start ignore */
	@tailwind base;
	@tailwind components;
	/* purgecss end ignore */

	@tailwind utilities;

	@layer base {
		body {
			@apply font-normal;
			@apply bg-flash-gray-900;
			@apply text-flash-gray-50;
		}
	}

	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
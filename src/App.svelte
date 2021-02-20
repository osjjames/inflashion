<script lang="ts">
	import Page from "./Page.svelte";
</script>

<main class="h-screen w-screen">
	<Page/>
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
			@apply p-0;
		}
	}

	main {
		text-align: center;
		max-width: 240px;
		margin: 0 auto;
		box-sizing: border-box;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
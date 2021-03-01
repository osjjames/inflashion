<script lang="ts">
    import BellCurveController from "./charts/BellCurveController.svelte";
    import {parameters} from "../store/simulation";
</script>

{#each Object.keys($parameters) as parameter}
    <BellCurveController bind:mu={$parameters[parameter].mu} bind:sigma={$parameters[parameter].sigma}/>
{/each}
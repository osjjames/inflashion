<script lang="ts">
    import BellCurveController from "./charts/BellCurveController.svelte";
    import {parameters} from "../store/simulation";
</script>

{#each Object.keys($parameters) as parameter}
    <BellCurveController bind:mu={$parameters[parameter].distribution.mu} bind:sigma={$parameters[parameter].distribution.sigma} getMessage={$parameters[parameter].messageGenerator}/>
{/each}
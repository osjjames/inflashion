<script lang="ts">
    import {simulation} from "../store/simulation";
    import {onMount} from "svelte";
    import IntervalTimer from "../utils/interval";

    $: sim = $simulation;

    let timer;

    onMount(() => {
       timer = new IntervalTimer({
           name: 'simulation',
           callback: simulation.nextDay,
           interval: 100
       });
       timer.start();
    });
</script>

<div>
    <span>Day: {sim.today}</span>
    <span>FPY: {sim.protocol.fpy}</span>
    <button class="w-32 h-32" on:click={() => timer.state === 'RUNNING' ? timer.pause() : timer.resume()}></button>
</div>
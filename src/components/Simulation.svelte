<script lang="ts">
    import {simulation} from "../store/simulation";
    import {onMount} from "svelte";
    import IntervalTimer from "../utils/interval";

    $: sim = $simulation;

    let timer;

    const togglePause = () => {
        switch (timer.state) {
            case 'IDLE': timer.start(); break;
            case 'RUNNING': timer.pause(); break;
            case 'PAUSED': timer.resume(); break;
            default: break;
        }
    }

    onMount(() => {
       timer = new IntervalTimer({
           name: 'simulation',
           callback: simulation.nextDay,
           interval: 100
       });
    });
</script>

<div>
    <span>Day: {sim.today}</span>
    <br/>
    <span>FPY: {(sim.protocol.fpy*100).toFixed(2)} %</span>
    <br/>
    <span>Total Supply: {sim.protocol.totalSupply.toFixed(0)}</span>
    <br/>
    <button class="w-32 h-32" on:click={togglePause}></button>
</div>
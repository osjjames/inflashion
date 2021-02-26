<script lang="ts">
    import {simulation} from "../store/simulation";
    import {onMount} from "svelte";
    import {IntervalTimer} from "../utils/interval";
    import type {IntervalTimerState} from "../utils/interval";
    import Button from "./input/Button.svelte";

    $: sim = $simulation;

    let timer: IntervalTimer;
    let buttonText: string = 'Start';

    const togglePause = () => {
        switch (timer.state) {
            case 'IDLE':
                timer.start();
                buttonText = 'Pause';
                break;
            case 'RUNNING':
                timer.pause();
                buttonText = 'Resume';
                break;
            case 'PAUSED':
                timer.resume();
                buttonText = 'Pause';
                break;
            default:
                break;
        }
    }

    const getButtonText = (state: IntervalTimerState) => {
        console.log(state);
        switch(state) {
            case 'IDLE': return 'Start';
            case 'PAUSED': return 'Resume';
            default: return 'Pause';
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
    <Button onClick={togglePause} width={48} height={16}>{buttonText}</Button>
</div>
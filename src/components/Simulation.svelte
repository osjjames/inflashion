<script lang="ts">
    import {simulation} from "../store/simulation";
    import {onMount} from "svelte";
    import {IntervalTimer} from "../utils/interval";
    import type {IntervalTimerState} from "../utils/interval";
    import Button from "./input/Button.svelte";
    import SimulationChart from "./SimulationChart.svelte";
    import type {Int} from "../utils/protocol";
    import {precision} from "../utils/protocol";
    import moment from 'moment';

    $: sim = $simulation;

    let timer: IntervalTimer;
    let buttonText: string = 'Start';

    const formatDuration = (days: Int) => {
        const duration = moment.duration(days, 'days');
        let length = '';
        length += duration.years() ? `${duration.years()} year${duration.years() > 1 ? 's' : ''}, ` : '';
        length += duration.months() ? `${duration.months()} month${duration.months() > 1 ? 's' : ''}, ` : '';
        length += `${duration.days()} day${duration.days() > 1 ? 's' : ''}`;
        return length;
    }

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
        switch (state) {
            case 'IDLE':
                return 'Start';
            case 'PAUSED':
                return 'Resume';
            default:
                return 'Pause';
        }
    }

    onMount(() => {
        timer = new IntervalTimer({
            name: 'simulation',
            callback: simulation.nextDay,
            interval: 20
        });
    });
</script>

<div class="w-full h-full">
    <span>Day: {sim.today} ({formatDuration(sim.today)})</span>
    <br/>
    <span>FPY: {(sim.protocol.fpy*100).toFixed(2)} %</span>
    <br/>
    <span>Total Supply: {(sim.protocol.totalSupply / precision).toFixed(0)}</span>
    <br/>
    <span>Total Staked: {(sim.protocol.totalStaked / precision).toFixed(0)}</span>
    <br/>
    <span>Total in FPY Match: {(sim.protocol.totalMatched / precision).toFixed(0)}</span>
    <br/>
    <Button onClick={togglePause} width={48} height={16}>{buttonText}</Button>
    <SimulationChart/>
</div>
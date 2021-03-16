<script lang="ts">
    import {simulation} from "../store/simulation";
    import {IntervalTimer} from "../utils/interval";
    import type {IntervalTimerState} from "../utils/interval";
    import moment from "moment";
    import {onMount} from "svelte";
    import type {Int} from "../utils/protocol";
    import {precision} from "../utils/protocol";
    import Button from "./input/Button.svelte";
    import SimulationStatCell from "./SimulationStatCell.svelte";

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
            interval: 10
        });
    });
</script>

<div class="flex flex-wrap overflow-hidden w-full border-2 border-flash-gray-600 rounded-2xl">
    <SimulationStatCell name="Day" value="{sim.today}">
        <span class="text-sm">({formatDuration(sim.today)})</span>
    </SimulationStatCell>
    <SimulationStatCell name="FPY" value="{(sim.protocol.fpy*100).toFixed(2)} %"/>
    <SimulationStatCell name="FPY Match"/>
    <SimulationStatCell name="Speed"/>
    <SimulationStatCell name="Total Supply" value="{(sim.protocol.totalSupply / precision).toFixed(0)}"/>
    <SimulationStatCell name="Total Staked" value="{(sim.protocol.totalStaked / precision).toFixed(0)}"/>
    <SimulationStatCell name="Total Matched" value="{(sim.protocol.totalMatched / precision).toFixed(0)}"/>
    <SimulationStatCell>
        <Button onClick={togglePause} width={48} height={16}>{buttonText}</Button>
    </SimulationStatCell>
</div>
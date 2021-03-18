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
    import Slider from "./input/Slider.svelte";

    $: sim = $simulation;

    let timer: IntervalTimer;
    let buttonText: string = 'Start';
    // let intervalMs: number = 13;
    let dps: number = 2;
    let lastIntervalStart;
    let actualSpeed;

    const formatDuration = (days: Int) => {
        const duration = moment.duration(days, 'days');
        let length = '';
        length += duration.years() ? `${duration.years()} year${duration.years() > 1 ? 's' : ''}, ` : '';
        length += duration.months() ? `${duration.months()} month${duration.months() > 1 ? 's' : ''}, ` : '';
        length += `${duration.days()} day${duration.days() > 1 ? 's' : ''}`;
        return length;
    }

    const togglePause = () => {
        switch (timer?.state) {
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

    const timerCallback = () => {
        actualSpeed = timer?.avgInterval ? `${(1000 / timer.avgInterval).toFixed(1)} d/s` : '';
        simulation.nextDay();
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
            callback: timerCallback,
            interval: intervalMs
        });
    });

    $: intervalMs = 1000/dps;
    $: timer?.setInterval(intervalMs);
</script>

<div class="grid grid-cols-2 lg:grid-cols-4 gap-4 overflow-hidden md:mx-8">
    <SimulationStatCell name="Day" value="{sim.today}">
        <span class="text-sm w-full text-center text-flash-gray-100 whitespace-nowrap overflow-hidden overflow-ellipsis">({formatDuration(sim.today)})</span>
    </SimulationStatCell>
    <SimulationStatCell name="FPY" value="{(sim.protocol.fpy*100).toFixed(2)} %"/>
    <SimulationStatCell name="FPY Match"/>
    <SimulationStatCell name="Speed">
        <div>
            <span class="text-xl">{dps.toFixed(0)}&nbsp;</span>
            <span class="text-sm">days per second</span>
        </div>
        <Slider inputClass={`w-36`} min="2" max="100" stepCount="50" bind:value={dps}></Slider>
        {#if actualSpeed}
            <span class="text-sm text-flash-gray-100">Actual: {actualSpeed}</span>
        {/if}
    </SimulationStatCell>
    <SimulationStatCell name="Total Supply" value="{(sim.protocol.totalSupply / precision).toFixed(0)}"/>
    <SimulationStatCell name="Total Staked" value="{(sim.protocol.totalStaked / precision).toFixed(0)}"/>
    <SimulationStatCell name="Total Matched" value="{(sim.protocol.totalMatched / precision).toFixed(0)}"/>
    <div class="flex justify-center items-center">
        <Button onClick={togglePause} width={40} height={16}>{buttonText}</Button>
    </div>

</div>
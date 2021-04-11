<script lang="ts">
    import {simulation} from "../store/simulation";
    import {agentDisplay} from "../store/agentDisplay";
    import {Agent} from "../utils/agent";
    import {Stake} from "../utils/protocol";
    import {precision} from "../utils/protocol";
    import {slide} from "svelte/transition"
    import PieChart from "./charts/PieChart.svelte";

    export let agent: Agent;
    const nf = new Intl.NumberFormat('en-US', {maximumSignificantDigits: 3});

    $: sim = $simulation;
    $: stakeProgress = agent.activeStake
        ? (sim.today - agent.activeStake.startDay) / (agent.activeStake.endDay - agent.activeStake.startDay)
        : 0
    const getProgress = (stake: Stake) => (sim.today - stake.startDay) / (stake.endDay - stake.startDay);

    $: pieSegments = agent.activeStake
        ? [{value: agent.activeStake.amount, name: 'Staked', color: '#FCFBFE'}, {value: agent.holdings - agent.activeStake.amount, name: 'Not staked', color: '#29282D'}]
        : [];
</script>

<div class="w-full overflow-hidden p-2 border-2 border-flash-gray-600 rounded-2xl" transition:slide={{duration: 200}}>
    <span><b>{agent.name}</b></span>
    <br/>
    <span>Holdings: {(agent.holdings / precision)}</span>
    <br/>
    {#if agent.activeStake && agent.activeStake.amount > 0}
        <span>Staked: {(agent.activeStake.amount / precision)}</span>
        <br/>
        <span>Progress: {(stakeProgress*100).toFixed(0)}%</span>
        <br/>
        <progress class="stake-progress" value={0.05 + (stakeProgress * 0.95)} max="1"></progress>
    {/if}
    <PieChart segments={pieSegments}/>
</div>

<style>
    progress {
        @apply rounded-2xl h-4 w-full;
    }
    progress::-webkit-progress-bar {
        @apply bg-flash-gray-300 rounded-2xl;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1) inset;
    }
    progress::-webkit-progress-value {
        @apply bg-flash-gradient rounded-2xl shadow-flash-blue;
    }
    progress::-moz-progress-bar {
        /* style rules */
    }
</style>
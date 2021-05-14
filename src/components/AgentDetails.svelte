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
    let showingUnstakeMessage: boolean = false;

    $: sim = $simulation;
    $: stakeProgress = agent.activeStake
        ? (sim.today - agent.activeStake.startDay) / (agent.activeStake.endDay - agent.activeStake.startDay)
        : 0
    const getProgress = (stake: Stake) => (sim.today - stake.startDay) / (stake.endDay - stake.startDay);

    $: pieSegments = agent.activeStake
        ? [{value: agent.activeStake.amount, name: 'Staked', color: '#FCFBFE'}, {value: agent.holdings - agent.activeStake.amount, name: 'Not staked', color: '#29282D'}]
        : [];

    const showUnstakeMessage = () => {
        showingUnstakeMessage = true;
        setTimeout(() => showingUnstakeMessage = false, 3000);
    }
</script>

<div class="w-full overflow-hidden p-3 border-2 border-flash-gray-600 rounded-2xl" transition:slide={{duration: 200}}>
    <div class="w-full text-center mb-3"><b>{agent.name}</b></div>

    <div class="flex justify-between mb-4">
        <span>Net worth</span>
        <span>{Math.round(agent.holdings / precision)} $FLASH</span>
    </div>
    <div class="w-full relative p-3 border-2 border-flash-gray-600 rounded-2xl h-44">
        {#if agent.activeStake && agent.activeStake.amount > 0}
            <div class="flex justify-between">
                <div class="flex flex-col">
                    <span>{Math.round(agent.activeStake.amount / precision)} $FLASH</span>
                    <span class="text-sm text-flash-gray-100">{((agent.activeStake.amount / agent.holdings)*100).toFixed(0)}% of net worth</span>
                </div>
                <PieChart segments={pieSegments}/>
            </div>
            <br/>
            <div class="stake-progress mb-2" data-label="{(stakeProgress*100).toFixed(0)}% completed">
                <span class="value" style="width:{5 + (stakeProgress * 95)}%;"></span>
            </div>
            <div class="flex justify-between mb-1">
                <span>Staked on</span>
                <span>Day {agent.activeStake.startDay}</span>
            </div>
            <div class="flex justify-between">
                <span>Duration</span>
                <span>{agent.activeStake.duration} days</span>
            </div>
        {:else}
            <div class="w-full h-full flex justify-center items-center">
                <div>No active stake</div>
            </div>
        {/if}
    </div>
</div>

<style>

    .stake-progress {
        @apply rounded-2xl h-4 w-full bg-flash-gray-300 relative;
    }
    .stake-progress:before {
        content: attr(data-label);
        @apply absolute text-sm text-center;
        top: -1px;
        left: 0;
        right: 0;
    }
    .stake-progress .value {
        @apply bg-flash-gradient rounded-2xl shadow-flash-blue inline-block h-full;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1) inset;
    }
</style>
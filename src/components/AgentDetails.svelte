<script lang="ts">
    import {simulation} from "../store/simulation";
    import {agentDisplay} from "../store/agentDisplay";
    import {Agent} from "../utils/agent";
    import {Stake} from "../utils/protocol";

    export let agent: Agent;

    $: sim = $simulation;
    $: stakeProgress = agent.activeStake
        ? (sim.today - agent.activeStake.startDay) / (agent.activeStake.endDay - agent.activeStake.startDay)
        : 0
    const getProgress = (stake: Stake) => (sim.today - stake.startDay) / (stake.endDay - stake.startDay);
</script>

<div class="w-full ">
    <span><b>{agent.name}</b></span>
    <br/>
    <span>Holdings: {agent.holdings.toFixed(0)}</span>
    <br/>
    {#if agent.activeStake}
        <span>Staked: {agent.activeStake.amount}</span>
        <br/>
        <span>Progress: {(stakeProgress*100).toFixed(1)}%</span>
        <br/>
        <progress value={stakeProgress} max="1"></progress>
    {/if}
</div>
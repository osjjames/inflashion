<script lang="ts">
    import {simulation} from "../store/simulation";
    import {agentDisplay} from "../store/agentDisplay";
    import {Agent} from "../utils/agent";
    import {Stake} from "../utils/protocol";

    export let agent: Agent;

    $: sim = $simulation;
    const getProgress = (stake: Stake) => (sim.today - stake.startDay) / (stake.endDay - stake.startDay);
</script>

<div class="w-full ">
    <span><b>{agent.name}</b></span>
    <br/>
    <span>Holdings: {agent.holdings.toFixed(0)}</span>
    <br/>
    {#if agent.activeStake}
        <span>Staked: {agent.activeStake.amount}</span>
        <span>Progress: {(getProgress(agent.activeStake)*100).toFixed(1)}%</span>
    {/if}
</div>
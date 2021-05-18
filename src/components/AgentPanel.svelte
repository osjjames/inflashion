<script lang="ts">
    import AgentGrid from "./AgentGrid.svelte";
    import AgentDetails from "./AgentDetails.svelte";
    import {simulation} from "../store/simulation";
    import {agentDisplay} from "../store/agentDisplay";

    // let population: number = 50;
    const maxPopulation = 100;

    $: sim = $simulation;
    $: agentDisplayStore = $agentDisplay;
    $: selectedAgent = sim.agents.find(a => a.name === agentDisplayStore.selectedAgentName);
</script>

<div class="w-full items-center flex flex-col lg:flex-row mb-8">
    <AgentGrid population={sim.agents.length} {maxPopulation} agents={sim.agents}/>
    {#if selectedAgent}
        <AgentDetails agent={selectedAgent}/>
    {/if}
</div>
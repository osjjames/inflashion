<script lang="ts">
    import FaUserAlt from 'svelte-icons/fa/FaUserAlt.svelte';
    import AgentCell from "./AgentCell.svelte";
    import { scale, fly } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';
    import type {Agent} from "../utils/agent";
    import {agentDisplay} from "../store/agentDisplay";
    import {simulation} from "../store/simulation";

    export let population: number;
    export let maxPopulation: number;
    export let agents: Agent[] = [];
    const peoplePerRow = 10;

    $: agentDisplayStore = $agentDisplay;
    $: sim = $simulation;
    $: selectedAgent = sim.agents.find(a => a.name === agentDisplayStore.selectedAgentName);

    $: population = agents.length;
    $: numberOfRows = Math.ceil(population / peoplePerRow);
    $: remainder = population % peoplePerRow;
</script>

<div class={`grid box-border`} style={`grid-template-columns: repeat(${peoplePerRow}, minmax(0, 1fr))`}>
    {#each agents as agent,i}
        <div transition:scale="{{duration: 200}}">
            <AgentCell {agent}/>
        </div>
    {/each}
    {#each Array(peoplePerRow-remainder) as _,k}
        <div></div>
    {/each}
</div>
<div>
    <pre>{JSON.stringify(selectedAgent)}</pre>
</div>
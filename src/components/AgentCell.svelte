<script lang="ts">
    import FaUserAlt from 'svelte-icons/fa/FaUserAlt.svelte';
    import IoMdPerson from 'svelte-icons/io/IoMdPerson.svelte';
    import tippy from "sveltejs-tippy";
    import type {Agent} from "../utils/agent";
    import {agentDisplay} from "../store/agentDisplay";

    export let agent: Agent = new Agent({name: 'Missing Agent', initialHoldings: 0});
    let widthClass = '8';

    $: agentDisplayStore = $agentDisplay;
    $: selected = agent.name === agentDisplayStore.selectedAgentName;
    const select = () => {
        agentDisplay.setSelectedAgent(selected ? null : agent.name);
    };

    const hoverTooltipProps = {
        allowHTML: true,
        content: "<div class='tooltip w-32'>" +
             `<div class="text-center"><b>${agent.name}</b></div>` +
            "<div class=\"text-center\"><em>(click for details)</em></div>" +
            "</div>",
        placement: "top",
        duration: 100,
    };
</script>

<!--<div class={`w-${widthClass} h-${widthClass} opacity-50`} class:staking={agent.activeStake?.amount > 0} use:tippy={props} class:selected on:click={select}>-->
<!--    <IoMdPerson/>-->
<!--</div>-->
<div class={`w-${widthClass} h-${widthClass} cursor-pointer`} style="opacity: {selected ? 100 : Math.round((agent.activeStake?.amount / agent.holdings) * 90) + 10}%" use:tippy={hoverTooltipProps} class:selected on:click={select}>
    <IoMdPerson/>
</div>

<style>
    .selected {
        @apply bg-flash-gray-300 rounded-full overflow-hidden
    }
</style>
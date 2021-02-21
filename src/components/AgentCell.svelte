<script lang="ts">
    import FaUserAlt from 'svelte-icons/fa/FaUserAlt.svelte';
    import IoMdPerson from 'svelte-icons/io/IoMdPerson.svelte';
    import tippy from "sveltejs-tippy";
    import type {Agent} from "../utils/agent";

    export let agent: Agent;
    let widthClass = '8';
    let selected: boolean = false;

    const props = {
        allowHTML: true,
        content: "<div class='tooltip w-32'>" +
             `<div class="text-center"><b>${agent.name}</b></div>` +
            "<div class=\"text-center\"><em>(click for details)</em></div>" +
            "</div>",
        placement: "top",
        duration: 100,
    };
</script>

<div class={`w-${widthClass} h-${widthClass}`} class:staking={agent.activeStake?.amount > 0} use:tippy={props} class:selected on:click={() => selected = !selected}>
    <IoMdPerson/>
</div>

<style>
    .selected {
        @apply border-2 border-flash-gray-50 rounded-full overflow-hidden
    }
    .staking {
        @apply opacity-50
    }
</style>
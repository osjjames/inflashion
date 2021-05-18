<script lang="ts">
    import Simulation from "./components/Simulation.svelte";
    import ParameterPanel from "./components/ParameterPanel.svelte";
    import AgentPanel from "./components/AgentPanel.svelte";
    import Accordion from "./components/Accordion.svelte";
</script>

<div class="flex flex-col items-center p-4 w-full h-full overflow-x-hidden overflow-y-scroll">
    <div class="w-full h-32 text-center mb-4 p-2 flex flex-col items-center">
        <div class="flex items-center justify-center mb-2">
            <img class="h-8 w-8 mr-6" src="assets/flash-logo.png"/>
            <b class="text-2xl">INFLASHION</b>
        </div>
        <span>An agent-based simulation of the Flash Protocol</span>
    </div>
    <div class="flex flex-col w-full mb-8 md:mx-8">
        <Accordion title="Simulation Parameters">
        <div class="w-full flex-col flex items-center lg:flex-row lg:justify-center lg:items-start">
            <ParameterPanel/>
        </div>
        </Accordion>
        <Accordion title="Agents">
        <div class="flex items-center flex-col">
<!--            <Slider inputClass="w-72" min="0" max={maxPopulation} step="1" bind:value={population}></Slider>-->
            <AgentPanel/>
        </div>
        </Accordion>
    </div>
    <Simulation/>
</div>
<script lang="ts">
    import Simulation from "./components/Simulation.svelte";
    import ParameterPanel from "./components/ParameterPanel.svelte";
    import AgentPanel from "./components/AgentPanel.svelte";
</script>

<div class="flex flex-col items-center p-4 w-full h-full overflow-x-hidden overflow-y-scroll">
    <div class="w-full h-48 text-center mb-8">
        <h1>Flash inflation</h1>
    </div>
    <div class="flex flex-col w-full">
        <div class="w-full flex-col flex items-center lg:flex-row lg:justify-center lg:items-start">
            <ParameterPanel/>
        </div>
        <div class="flex items-center flex-col">
<!--            <Slider inputClass="w-72" min="0" max={maxPopulation} step="1" bind:value={population}></Slider>-->
            <AgentPanel/>
        </div>
    </div>
    <Simulation/>
</div>
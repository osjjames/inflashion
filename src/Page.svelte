<script lang="ts">
    import AgentGrid from "./components/AgentGrid.svelte";
    import Slider from "./components/input/Slider.svelte";

    import Simulation from "./components/Simulation.svelte";
    import {simulation} from "./store/simulation";
    import ParameterPanel from "./components/ParameterPanel.svelte";

    let population: number = 50;
    const maxPopulation = 100;

    $: sim = $simulation;
</script>

<div class="flex flex-col items-center p-4 w-full h-full overflow-hidden">
    <div class="w-full h-48">
        <h1>Flash inflation</h1>
    </div>
    <div class="flex justify-between w-full">
        <div class="w-1/2">
            <ParameterPanel/>
        </div>
        <div class="w-1/2 flex items-end flex-col">
<!--            <Slider inputClass="w-72" min="0" max={maxPopulation} step="1" bind:value={population}></Slider>-->
            <AgentGrid {population} {maxPopulation} agents={sim.agents}/>
        </div>
    </div>
    <Simulation/>
</div>
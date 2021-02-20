<script lang="ts">
    import AgentGrid from "./components/AgentGrid.svelte";
    import Slider from "./components/input/Slider.svelte";
    import BellCurveController from "./components/charts/BellCurveController.svelte";

    let population: number = 50;
    const maxPopulation = 100;
</script>

<div class="flex flex-col items-center p-4 w-full h-full overflow-hidden">
    <div class="w-full h-48">
        <h1>Flash inflation</h1>
    </div>
    <div class="flex justify-between w-full h-full">
        <div class="w-1/2">
            <BellCurveController/>
        </div>
        <div class="w-1/2 flex items-end flex-col">
            <Slider inputClass="w-72" min="0" max={maxPopulation} step="1" bind:value={population}></Slider>
            <AgentGrid {population} {maxPopulation}/>
        </div>
    </div>
</div>
<script lang="ts">
    import {simulation} from "../store/simulation";
    import {agentDisplay} from "../store/agentDisplay";
    import {Agent} from "../utils/agent";
    import {Stake} from "../utils/protocol";
    import {precision} from "../utils/protocol";
    import {slide} from "svelte/transition"
    import PieChart from "./charts/PieChart.svelte";
</script>

<div class="w-full max-w-xs overflow-hidden p-3 border-2 border-flash-gray-600 rounded-2xl flex items-center justify-center h-72">
    <div class="text-center mb-3">Click on an agent for more information</div>
</div>
<script lang="ts">
    export let min: number;
    export let max: number;
    export let step: number;
    export let value: number;
</script>

<label for="slider" name="slider">
    slid
    <input id="slider" type="range" {min} {max} {step} bind:value/>
</label>

<style>

</style>
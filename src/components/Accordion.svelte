<script lang="ts">
    import { slide } from 'svelte/transition';
    import IoIosPlay from 'svelte-icons/io/IoIosPlay.svelte';
    import {flip} from 'svelte/animate';

    export let title: string;
    let open = false;

    const toggleOpen = () => open = !open;
</script>

<div class="p-3 border-2 border-flash-gray-600 rounded-2xl mb-4">
    <div class="cursor-pointer flex justify-between items-center" on:click={toggleOpen}>
        <b>{title}</b>
        <div class="w-5 h-5">
            <IoIosPlay></IoIosPlay>
        </div>
    </div>
    {#if open}
        <div class="mt-2" transition:slide="{{duration: 300}}">
            <slot></slot>
        </div>
    {/if}
</div>

<style>
    .arrow {

    }

    @keyframes spin {
        from {
            transform: rotate(0);
        }

        to {
            transform: rotate(90deg);
        }
    }
</style>
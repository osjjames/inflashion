<script lang="ts">
    import BellCurveController from "./charts/BellCurveController.svelte";
    import {parameters} from "../store/simulation";
    import pdf from "distributions-truncated-normal-pdf";
    import {truncatedCdf, truncatedSigma} from "../utils/probability";

    type ProbabilityMessages = {
        stakeProportion: string,
        stakeDuration: string,
        stakeCompletion: string
    }
    let probabilityMessages: ProbabilityMessages;
    let range = 0.1; // How far on either side of the mean will we measure?

    $: {
        let truncatedCdfs = {
            stakeProportion: truncatedCdf($parameters.stakeProportion),
            stakeDuration: truncatedCdf($parameters.stakeDuration),
            stakeCompletion: truncatedCdf($parameters.stakeCompletion),
        }
        let bounds = {
            stakeProportion: {
                lower: Math.max(0, $parameters.stakeProportion.mu - range),
                upper: Math.min(1, $parameters.stakeProportion.mu + range)
            },
            stakeDuration: {
                lower: Math.max(0, $parameters.stakeDuration.mu - range),
                upper: Math.min(1, $parameters.stakeDuration.mu + range)
            },
            stakeCompletion: {
                lower: Math.max(0, $parameters.stakeCompletion.mu - range),
                upper: Math.min(1, $parameters.stakeCompletion.mu + range)
            }
        }
        let figures = {
            stakeProportion: [
                ($parameters.stakeProportion.sigma === 0
                    ? 100
                    : (pdf($parameters.stakeProportion.mu, {a: 0, b: 1, mu: $parameters.stakeProportion.mu, sigma: $parameters.stakeProportion.sigma}))),
                ($parameters.stakeProportion.mu * 100)
            ],
            stakeDuration: [
                // ($parameters.stakeDuration.mu - (truncatedSigma($parameters.stakeDuration))) * 100,
                // ($parameters.stakeDuration.mu + (truncatedSigma($parameters.stakeDuration))) * 100
                (truncatedCdfs.stakeDuration(bounds.stakeDuration.upper) - truncatedCdfs.stakeDuration(bounds.stakeDuration.lower)) * 100,
                bounds.stakeDuration.lower * 100,
                bounds.stakeDuration.upper * 100
            ],
            stakeCompletion: []
        }
        probabilityMessages = {
            stakeProportion: `${figures.stakeProportion[0].toFixed(1)}% of agents will stake ${figures.stakeProportion[1].toFixed(0)}% of their total holdings`,
            stakeDuration: (()=>{
                switch ($parameters.stakeDuration.sigma) {
                    case 0: return `All agents will stake for ${($parameters.stakeDuration.mu*100).toFixed(0)}% of the maximum stake duration`;
                    case Infinity: return 'All agents will stake for a totally random duration.';
                    default: return `${figures.stakeDuration[0].toFixed(1)}% of agents will stake for ${figures.stakeDuration[1].toFixed(0)}-${figures.stakeDuration[2].toFixed(0)}% of the maximum stake duration`
                }
            })(),
            stakeCompletion: ''
        };
    }
</script>

{#each Object.keys($parameters) as parameter}
    <BellCurveController bind:mu={$parameters[parameter].mu} bind:sigma={$parameters[parameter].sigma}/>
{/each}
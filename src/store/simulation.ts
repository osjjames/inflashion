import {derived, writable} from 'svelte/store';
import {Parameter, Simulation, SimulationParameters} from "../utils/simulation";
import type {Day} from "../utils/protocol";
import type {TruncatedNormalDistribution} from "../utils/probability";

function createSimulation(initial: Simulation) {
    const simStore = writable(initial);
    const { subscribe, set, update } = simStore;

    return {
        subscribe,
        nextDay: () => update(s => s.beginDay()),
        today: derived(simStore, s => s.today),
        agents: derived(simStore, s => s.agents),
        protocol: derived(simStore, s => s.protocol)
    };
}

function createParameters(initial: SimulationParameters) {
    return writable(initial);
    // const { subscribe, set, update } = paramsStore;
    //
    // return {
    //     subscribe
    // };
}

export const simulation = createSimulation(new Simulation({
    totalSupply: 1000000,
    population: 100,
    initialDay: 1
}));

export const parameters = createParameters({
    stakeProportion: (new Parameter({
        name: 'Stake Proportion',
        distribution: {
            bounds: {lower: 0, upper: 1},
            mu: 0.5,
            sigma: 0.1
        },
        messageGenerator: ((mu, sigma, bounds, area) => {
            switch (sigma) {
                case 0: return (() => {
                    switch (mu) {
                        case 0: return `Nobody will stake.`;
                        case 1: return `Everybody will stake all of their holdings.`;
                        default: return `Everybody will stake ${(mu*100).toFixed(0)}% of their holdings.`;
                    }})();
                case Infinity: return 'Everybody will stake a random amount of their holdings.';
                default: return `${(area*100).toFixed(1)}% of people will stake ${(bounds.lower*100).toFixed(0)}-${(bounds.upper*100).toFixed(0)}% of their holdings.`;
            }
        })
    })),
    stakeDuration: (new Parameter({
        name: 'Stake Duration',
        distribution: {
            bounds: {lower: 0, upper: 1},
            mu: 0.5,
            sigma: 0.1
        },
        messageGenerator: ((mu, sigma, bounds, area) => {
            switch (sigma) {
                case 0: return (() => {
                    switch (mu) {
                        case 0: return `Nobody will stake.`;
                        case 1: return `Everybody will stake for the maximum stake duration.`;
                        default: return `Everybody will stake for ${(mu*100).toFixed(0)}% of the maximum stake duration.`;
                    }})();
                case Infinity: return 'Everybody will stake for a random duration.';
                default: return `${(area*100).toFixed(1)}% of people will stake for ${(bounds.lower*100).toFixed(0)}-${(bounds.upper*100).toFixed(0)}% of the maximum stake duration`;
            }
        })
    })),
    stakeCompletion: (new Parameter({
        name: 'Stake Completion',
        distribution: {
            bounds: {lower: 0, upper: 1},
            mu: 0.5,
            sigma: 0.1
        },
        messageGenerator: ((mu, sigma, bounds, area) => {
            switch (sigma) {
                case 0: return (() => {
                    switch (mu) {
                        case 0: return `Nobody will stake.`;
                        case 1: return `Everybody will complete their stake.`;
                        default: return `Everybody will unstake after ${(mu*100).toFixed(0)}% of their stake is completed.`;
                    }})();
                case Infinity: return 'Everybody will randomly unstake at some point.';
                default: return `${(area*100).toFixed(1)}% of people will unstake after ${(bounds.lower*100).toFixed(0)}-${(bounds.upper*100).toFixed(0)}% of their stake is completed.`;
            }
        })
    }))
});
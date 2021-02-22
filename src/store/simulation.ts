import {derived, writable} from 'svelte/store';
import {Simulation, SimulationParameters} from "../utils/simulation";
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
    stakeProportion: {
        bounds: {lower: 0, upper: 1},
        mu: 1,
        sigma: 0
    },
    stakeDuration: {
        bounds: {lower: 0, upper: 1},
        mu: 1,
        sigma: 0
    },
    stakeCompletion: {
        bounds: {lower: 0, upper: 1},
        mu: 0.1,
        sigma: 0.1
    }
});
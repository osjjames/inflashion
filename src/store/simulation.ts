import { writable } from 'svelte/store';
import {Simulation} from "../utils/simulation";

function createSimulation(initial: Simulation) {
    const { subscribe, set, update } = writable(initial);

    return {
        subscribe
    };
}

export const simulation = createSimulation(new Simulation({
    totalSupply: 1000000,
    population: 100,
    parameters: {
        stakeProportion: {
            bounds: {lower: 0, upper: 1},
            mu: 0.5,
            sigma: 0.5
        },
        stakeDuration: {
            bounds: {lower: 0, upper: 1},
            mu: 0.5,
            sigma: 0.5
        },
        stakeCompletion: {
            bounds: {lower: 0, upper: 1},
            mu: 0.5,
            sigma: 0.5
        }
    }
}));
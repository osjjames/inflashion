import { writable } from 'svelte/store';
import type {Day} from "../utils/protocol";

function startClock(startDay: Day = 0) {
    const { subscribe, set, update } = writable(startDay);

    return {
        subscribe,
        nextDay: () => update(n => n + 1)
    };
}

export const currentDay = startClock();
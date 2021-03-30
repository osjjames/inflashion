import {readable, writable} from 'svelte/store';
import type {Day} from "../utils/protocol";

function createSpeed(initialDaysPerSecond: number) {
    return writable(initialDaysPerSecond);
}

export const speed = createSpeed(2);
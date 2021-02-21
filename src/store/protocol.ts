import { writable } from 'svelte/store';
import type {Protocol, Stake, Unstake} from "../utils/protocol";
import {
    initialiseProtocol,
    updateProtocolFromStake,
    updateProtocolFromStakeEnd,
    updateProtocolFromUnstake
} from "../utils/protocol";

function createProtocol(initial: Protocol) {
    const { subscribe, set, update } = writable(initial);

    return {
        subscribe,
        updateFromStake: (stake: Stake) => update(updateProtocolFromStake(stake)),
        updateFromUnstake: (unstake: Unstake) => update(updateProtocolFromUnstake(unstake)),
        updateFromStakeEnd: (stake: Stake) => update(updateProtocolFromStakeEnd(stake))
    };
}

export const protocol = createProtocol(initialiseProtocol(1000000));
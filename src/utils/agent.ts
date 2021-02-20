import type {Stake} from "./protocol";

export type Agent = {
    name: string,
    holdings: number, // total holdings, including active stake amount
    stake: Stake
}
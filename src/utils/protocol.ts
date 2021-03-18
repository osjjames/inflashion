import type {AgentAction} from "./agent";
import {probRound} from "./probability";
import {SimulationParameters} from "./simulation";
import {fpyMatch} from "../store/simulation";

export type Int = number & { __int__: void };
export const roundToInt = (num: number): Int => Math.round(num) as Int;

export type Day = number;

export const precision: number = 1e5;
// const round = (x: number) => probRound(x, precision, 'FLOOR');

type StakeProps = {
    amount: Int,
    duration: number,
    startDay: Day,
    fpy: number
}
export class Stake {
    readonly amount: Int;
    readonly duration: number;
    readonly startDay: Day;
    readonly endDay: Day;
    readonly flashYield: Int;

    constructor(props: StakeProps) {
        this.amount = props.amount;
        this.duration = props.duration;
        this.startDay = props.startDay;
        this.endDay = roundToInt(props.startDay + props.duration);
        this.flashYield = roundToInt((props.amount * props.duration * props.fpy) / 365);
    }
}

type UnstakeProps = {
    stake: Stake,
    day: Day,
    totalStaked: Int,
    totalSupply: Int
}
export class Unstake {
    readonly stake: Stake;
    readonly day: Day;
    readonly burned: Int;

    constructor(props: UnstakeProps) {
        this.stake = props.stake;
        this.day = props.day;
        this.burned = roundToInt(props.stake.amount * ((props.stake.endDay - props.day) / props.stake.duration));
    }
}

type ProtocolProps = {
    totalSupply: Int
}

export class Protocol {
    private _totalSupply: Int; // All circulating supply
    private _totalStaked: Int; // All currently locked in a stake
    private _totalMatched: Int; // All currently in the FPY match wallet
    private _fpy: number;
    private _maxStakeDuration: number;

    constructor(props: ProtocolProps) {
        this._totalSupply = props.totalSupply;
        this._totalStaked = 0 as Int;
        this._totalMatched = 0 as Int;
        this._fpy = 0.5;
        this._maxStakeDuration = 365 as Int;
    }

    get totalSupply() {return this._totalSupply}
    get totalStaked() {return this._totalStaked}
    get totalMatched() {return this._totalMatched}
    get fpy() {return this._fpy}
    get maxStakeDuration() {return this._maxStakeDuration}
    set totalSupply(x) {this._totalSupply = x}
    set totalStaked(x) {this._totalStaked = x}

    private registerStake = (stake: Stake) => {
        let currentFpyMatch: number;
        fpyMatch.subscribe(x => currentFpyMatch = x);

        this._fpy = probRound((1 - ((this._totalStaked + stake.amount) / this._totalSupply)) / 2, precision);
        this._maxStakeDuration = roundToInt(Math.floor((0.5 / this._fpy) * 365));
        this._totalSupply = roundToInt(this._totalSupply + stake.flashYield);
        this._totalStaked = roundToInt(this._totalStaked + stake.amount);

        const fpyMatchAmount: Int = roundToInt(stake.flashYield * currentFpyMatch);
        this._totalMatched = roundToInt(this._totalMatched + fpyMatchAmount);
        this._totalSupply = roundToInt(this._totalSupply + fpyMatchAmount);
    }

    private registerUnstake = (unstake: Unstake) => {
        this._totalSupply = roundToInt(this._totalSupply - unstake.burned);
        this._totalStaked = roundToInt(this._totalStaked - unstake.stake.amount);
    }

    private registerStakeEnd = (stake: Stake) => {
        this._totalStaked = roundToInt(this._totalStaked - stake.amount);
    }

    public registerAgentAction = (action: AgentAction) => {
        switch(action.type) {
            case "STAKE":
                this.registerStake(action.payload);
                break;
            case "UNSTAKE":
                this.registerUnstake(action.payload);
                break;
            case "STAKE_END":
                this.registerStakeEnd(action.payload);
                break;
        }
    }
}
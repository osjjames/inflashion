import type {AgentAction} from "./agent";
import {probRound} from "./probability";

export type Day = number;

const precision: number = 1e8;
const round = (x: number) => probRound(x, precision, 'FLOOR');

type StakeProps = {
    amount: number,
    duration: number,
    startDay: Day,
    fpy: number
}
export class Stake {
    readonly amount: number;
    readonly duration: number;
    readonly startDay: Day;
    readonly endDay: Day;
    readonly flashYield: number;

    constructor(props: StakeProps) {
        this.amount = round(props.amount);
        this.duration = props.duration;
        this.startDay = props.startDay;
        this.endDay = props.startDay + props.duration;
        this.flashYield = round((props.amount * props.duration * props.fpy) / 365);
        console.log(props);
        console.log(this.flashYield);
    }
}

type UnstakeProps = {
    stake: Stake,
    day: Day,
    totalStaked: number,
    totalSupply: number
}
export class Unstake {
    readonly stake: Stake;
    readonly day: Day;
    readonly burned: number;

    constructor(props: UnstakeProps) {
        this.stake = props.stake;
        this.day = props.day;
        this.burned = round(props.stake.amount * ((props.stake.endDay - props.day) / props.stake.duration));
    }
}

type ProtocolProps = {
    totalSupply: number
}

export class Protocol {
    private _totalSupply: number; // All circulating supply
    private _totalStaked: number; // All currently locked in a stake
    private _fpyMatch: number; // Percent of each yield that is additionally minted for the FPY match wallet (2-20%)
    private _totalMatched: number; // All currently in the FPY match wallet
    private _fpy: number;
    private _maxStakeDuration: number;

    constructor(props: ProtocolProps) {
        this._totalSupply = props.totalSupply;
        this._totalStaked = 0;
        this._totalMatched = 0;
        this._fpyMatch = 0.02;
        this._fpy = 0.5;
        this._maxStakeDuration = 365;
    }

    get totalSupply() {return this._totalSupply}
    get totalStaked() {return this._totalStaked}
    get totalMatched() {return this._totalMatched}
    get fpyMatch() {return this._fpyMatch}
    get fpy() {return this._fpy}
    get maxStakeDuration() {return this._maxStakeDuration}
    set totalSupply(x) {this._totalSupply = x}
    set totalStaked(x) {this._totalStaked = x}

    private registerStake = (stake: Stake) => {
        // console.log(this._totalStaked);
        // console.log(this._totalSupply);
        if (this._totalStaked + stake.amount > this._totalSupply) {
            // This guy is staking more than he can possibly stake. Actual total supply is higher than calculated total supply
            console.log(this._totalStaked);
            console.log(stake.amount);
            console.log(this._totalSupply);
            console.log(stake);
            console.log()
        }
        console.log(this._totalStaked);
        console.log(stake.amount);
        console.log(this._totalSupply);
        // console.log(this._totalStaked);
        this._fpy = probRound((1 - ((this._totalStaked + stake.amount) / this._totalSupply)) / 2, 1e18);
        console.log(this._fpy);
        this._maxStakeDuration = Math.floor((0.5 / this._fpy) * 365);
        this._totalSupply += stake.flashYield;
        this._totalStaked += stake.amount;

        const fpyMatchAmount = stake.flashYield * this._fpyMatch;
        this._totalMatched += fpyMatchAmount;
        this._totalSupply += fpyMatchAmount;
    }

    private registerUnstake = (unstake: Unstake) => {
        // console.log(this._totalSupply);
        // console.log(unstake.burned);
        // console.log(unstake.stake.amount);
        this._totalSupply -= unstake.burned;
        this._totalStaked -= unstake.stake.amount;
    }

    private registerStakeEnd = (stake: Stake) => {
        this._totalStaked -= stake.amount;
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
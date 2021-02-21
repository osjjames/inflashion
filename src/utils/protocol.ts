import {AgentAction} from "./agent";

export type Day = number;

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
        this.amount = props.amount;
        this.duration = props.duration;
        this.startDay = props.startDay;
        this.endDay = props.startDay + props.duration;
        this.flashYield = (props.amount * props.duration * props.fpy) / 365
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
        this.burned = ((props.stake.amount * (props.day - props.stake.startDay)) / props.stake.duration) * ((props.totalStaked - props.stake.amount) / props.totalSupply);
    }
}

type ProtocolProps = {
    totalSupply: number
}

export class Protocol {
    private _totalSupply: number;
    private _totalStaked: number;
    private _fpy: number;

    constructor(props: ProtocolProps) {
        this._totalSupply = props.totalSupply;
        this._totalStaked = 0;
        this._fpy = 0.5;
    }

    get totalSupply() {return this.totalSupply}
    get totalStaked() {return this.totalStaked}
    get fpy() {return this.fpy}

    private registerStake = (stake: Stake) => {
        this._fpy = (1 - ((this._totalStaked + stake.amount) / this._totalSupply)) / 2;
        this._totalSupply += stake.flashYield;
        this._totalStaked += stake.amount;
    }

    private registerUnstake = (unstake: Unstake) => {
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
            default:
                throw new Error(`Action type ${action.type} not recognised`);
        }
    }
}
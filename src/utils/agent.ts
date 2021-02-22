import type {Day} from "./protocol";
import type {Simulation, SimulationParameters} from "./simulation";
import {randomTrunc} from "./probability";
import {Stake, Unstake} from "./protocol";
import {parameters} from "../store/simulation";
import {get} from "svelte/store";

type StakeAction = {
    type: 'STAKE',
    payload: Stake
}
type UnstakeAction = {
    type: 'UNSTAKE',
    payload: Unstake
}
type StakeEndAction = {
    type: 'STAKE_END',
    payload: Stake
}
export type AgentAction = StakeAction | UnstakeAction | StakeEndAction;

type AgentProps = {
    name: string,
    initialHoldings: number
}
export class Agent {
    readonly name: string;
    private _holdings: number; // total holdings, including active stake amount
    private _activeStake: Stake | null;
    private _queuedUnstakeDay: Day | null; // day that current stake will be unstaked. Recalculated if stakeCompletion parameter changes

    constructor(props: AgentProps) {
        this.name = props.name;
        this._holdings = props.initialHoldings;
        this._activeStake = null;
        this._queuedUnstakeDay = null;
    }

    get holdings() {return this._holdings}
    get activeStake() {return this._activeStake}

    private registerStake = (stake: Stake, queuedUnstakeDay: Day) => {
        this._activeStake = stake;
        this._holdings += stake.flashYield;
        this._queuedUnstakeDay = queuedUnstakeDay;
    }

    private registerUnstake = (unstake: Unstake) => {
        if (unstake.stake !== this._activeStake) {
            throw new Error('Active stake does not match the referenced stake in the unstake object.');
        }
        this._activeStake = null;
        this._queuedUnstakeDay = null;
        this._holdings -= unstake.burned;
    }

    private registerStakeEnd = () => {
        this._activeStake = null;
        this._queuedUnstakeDay = null;
    }

    public dailyCheck = (today: Day, simulation: Simulation): Array<AgentAction> => {
        let actions: Array<AgentAction> = [];

        let currentParameters: SimulationParameters;
        parameters.subscribe(params => currentParameters = params);

        if (this._activeStake === null) {
            const stake = new Stake({
                amount: Math.round(randomTrunc(currentParameters.stakeProportion) * this._holdings),
                duration: Math.ceil(randomTrunc(currentParameters.stakeDuration) * simulation.protocol.maxStakeDuration),
                startDay: today,
                fpy: simulation.protocol.fpy
            });
            const queuedUnstakeDay = today + Math.ceil(randomTrunc(currentParameters.stakeCompletion) * stake.duration);

            if (stake.duration > 0 && queuedUnstakeDay > today) {
                if (stake.amount > 0) {
                    actions.push({
                        type: "STAKE",
                        payload: stake
                    });
                }
                this.registerStake(stake, queuedUnstakeDay);
            }
        } else if (this._activeStake.endDay === today) {
            actions.push({
                type: "STAKE_END",
                payload: this._activeStake
            });
            this.registerStakeEnd();
        } else if (this._queuedUnstakeDay === today) {
            const unstake = new Unstake({
                stake: this._activeStake,
                day: today,
                totalStaked: simulation.protocol.totalStaked,
                totalSupply: simulation.protocol.totalSupply
            });
            if (unstake.stake.amount > 0) {
                actions.push({
                    type: "UNSTAKE",
                    payload: unstake
                });
            }
            this.registerUnstake(unstake);
        }

        return actions;
    }
}

export const initialiseAgents = (population: number, totalSupply: number): Array<Agent> => {
    let agents: Array<Agent> = [];
    const holdingsPerAgent = totalSupply / population;
    for (let i = 0; i < population; i++) {
        agents.push(new Agent({
            name: `Agent ${String(i).padStart(String(population).length, '0')}`,
            initialHoldings: holdingsPerAgent
        }));
    }
    return agents;
}
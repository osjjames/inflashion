import type {Agent, AgentAction} from "./agent";
import type {TruncatedNormalDistribution} from "./probability";
import type {Day} from "./protocol";
import {Protocol} from "./protocol";
import {initialiseAgents} from "./agent";

export const MAX_STAKE_DURATION = 365;

export type SimulationParameters = {
    stakeProportion: TruncatedNormalDistribution, // Average percentage of net worth staked
    stakeDuration: TruncatedNormalDistribution, // Average duration of stake
    stakeCompletion: TruncatedNormalDistribution // Average percentage of stake duration completed before unstaking
}

type SimulationProps = {
    totalSupply: number,
    population: number,
    parameters: SimulationParameters
}
export class Simulation {
    private _agents: Array<Agent>;
    private _parameters: SimulationParameters;
    private _protocol: Protocol;

    constructor(props: SimulationProps) {
        this._agents = initialiseAgents(props.population, props.totalSupply);
        this._parameters = props.parameters;
        this._protocol = new Protocol({totalSupply: props.totalSupply});
    }

    get agents() {return this.agents}
    get parameters() {return this.parameters}
    get protocol() {return this.protocol}

    public startDay = (day: Day) => {
        for (let agent of this._agents) {
            const actions = agent.dailyCheck(day, this);
            for (let action of actions) {
                this._protocol.registerAgentAction(action);
            }
        }
    }
}
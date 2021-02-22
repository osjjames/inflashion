import type {Agent, AgentAction} from "./agent";
import type {TruncatedNormalDistribution} from "./probability";
import type {Day} from "./protocol";
import {Protocol} from "./protocol";
import {initialiseAgents} from "./agent";

export type SimulationParameters = {
    stakeProportion: TruncatedNormalDistribution, // Average percentage of net worth staked
    stakeDuration: TruncatedNormalDistribution, // Average duration of stake
    stakeCompletion: TruncatedNormalDistribution // Average percentage of stake duration completed before unstaking
}

type SimulationProps = {
    totalSupply: number,
    population: number,
    parameters: SimulationParameters,
    initialDay: Day
}
export class Simulation {
    private _agents: Array<Agent>;
    private _parameters: SimulationParameters;
    private _protocol: Protocol;
    private _today: Day;

    constructor(props: SimulationProps) {
        this._agents = initialiseAgents(props.population, props.totalSupply);
        this._parameters = props.parameters;
        this._protocol = new Protocol({totalSupply: props.totalSupply});
        this._today = props.initialDay;
    }

    get agents() {return this._agents}
    get parameters() {return this._parameters}
    get protocol() {return this._protocol}
    get today() {return this._today}

    public beginDay = (): Simulation => {
        for (let agent of this._agents) {
            const actions = agent.dailyCheck(this._today, this);
            for (let action of actions) {
                this._protocol.registerAgentAction(action);
            }
        }
        this._today += 1;
        return this;
    }
}
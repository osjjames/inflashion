import type {Agent, AgentAction} from "./agent";
import type {TruncatedNormalDistribution} from "./probability";
import type {Day, Int} from "./protocol";
import {Protocol, roundToInt} from "./protocol";
import {initialiseAgents} from "./agent";
import type {Bounds} from "./probability";

export type SimulationParameters = {
    stakeProportion: Parameter, // Average percentage of net worth staked
    stakeDuration: Parameter, // Average duration of stake
    stakeCompletion: Parameter // Average percentage of stake duration completed before unstaking
}
type ParameterProps = {
    name: string,
    description: string,
    distribution: TruncatedNormalDistribution,
    messageGenerator: MessageGenerator
}
export type MessageGenerator = (mu: number, sigma: number, bounds: Bounds, area: number) => string;
export class Parameter {
    readonly name: string;
    readonly description: string;
    private _distribution: TruncatedNormalDistribution;
    readonly messageGenerator: MessageGenerator;

    get distribution() {return this._distribution}

    constructor(props: ParameterProps) {
        this.name = props.name;
        this.description = props.description;
        this._distribution = props.distribution;
        this.messageGenerator = props.messageGenerator;
    }
}

type SimulationProps = {
    totalSupply: Int,
    population: Int,
    initialDay: Day
}
export class Simulation {
    private _agents: Array<Agent>;
    private _protocol: Protocol;
    private _today: Day;
    private _history: Protocol[];

    constructor(props: SimulationProps) {
        this._agents = initialiseAgents(props.population, props.totalSupply);
        this._protocol = new Protocol({totalSupply: props.totalSupply});
        this._today = props.initialDay;
        this._history = [];
    }

    get agents() {return this._agents}
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
        this._history = [...this._history, this._protocol];
        return this;
    }
}
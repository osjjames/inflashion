import type {Agent, AgentAction} from "./agent";
import type {TruncatedNormalDistribution} from "./probability";
import type {Day} from "./protocol";
import {Protocol} from "./protocol";
import {initialiseAgents} from "./agent";
import type {Bounds} from "./probability";

export type SimulationParameters = {
    stakeProportion: Parameter, // Average percentage of net worth staked
    stakeDuration: Parameter, // Average duration of stake
    stakeCompletion: Parameter // Average percentage of stake duration completed before unstaking
}
type ParameterProps = {
    name: string,
    distribution: TruncatedNormalDistribution,
    messageGenerator: MessageGenerator
}
export type MessageGenerator = (mu: number, sigma: number, bounds: Bounds, area: number) => string;
export class Parameter {
    readonly name: string;
    private _distribution: TruncatedNormalDistribution;
    readonly messageGenerator: MessageGenerator;

    get distribution() {return this._distribution}

    constructor(props: ParameterProps) {
        this.name = props.name;
        this._distribution = props.distribution;
        this.messageGenerator = props.messageGenerator;
    }
}

type SimulationProps = {
    totalSupply: number,
    population: number,
    initialDay: Day
}
export class Simulation {
    private _agents: Array<Agent>;
    private _protocol: Protocol;
    private _today: Day;

    constructor(props: SimulationProps) {
        this._agents = initialiseAgents(props.population, props.totalSupply);
        this._protocol = new Protocol({totalSupply: props.totalSupply});
        this._today = props.initialDay;
    }

    get agents() {return this._agents}
    get protocol() {return this._protocol}
    get today() {return this._today}

    public beginDay = (): Simulation => {
        let total = 0;
        let totalStaked = 0;
        for (let agent of this._agents) {
            // console.log(agent.holdings);
            total += agent.holdings;
            totalStaked += agent.activeStake?.amount || 0;
        }
        console.log(total);
        console.log(this._protocol.totalStaked - totalStaked);
        // this._protocol.totalSupply = total;
        // this._protocol.totalStaked = totalStaked;
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
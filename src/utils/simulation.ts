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
// type ParameterProps = {
//     name: string,
//     distribution: TruncatedNormalDistribution
// }
// export class Parameter {
//     private _name: string;
//     private _distribution: TruncatedNormalDistribution;
//     public getMessage: (range: number) => string;
//
//     get name() {return this._name}
//     get distribution() {return this._distribution}
//
//     constructor(props: ParameterProps) {
//         this._name = props.name;
//         this._distribution = props.distribution;
//         this.getMessage = (range) => {
//             switch (this._distribution.sigma) {
//                 case 0: return 'All agents will '
//             }
//         }
//     }
// }

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
        console.log(this);
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
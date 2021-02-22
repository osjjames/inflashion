import { writable } from 'svelte/store';
import type {Agent} from "../utils/agent";

type AgentDisplayStore = {
    selectedAgentName: string | null
}

function createAgentDisplay(initial: AgentDisplayStore) {
    const agentDisplayStore = writable(initial);
    const { subscribe, set, update } = agentDisplayStore;

    return {
        subscribe,
        setSelectedAgent: (agentName: AgentDisplayStore["selectedAgentName"]) => update(n => ({...n, selectedAgentName: agentName}))
    };
}

export const agentDisplay = createAgentDisplay({
    selectedAgentName: null
});
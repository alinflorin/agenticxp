import { Agent } from '@/shared-schemas/agent';
import { PagedRequest } from '@/shared-schemas/paged-request';
import { PagedResponse } from '@/shared-schemas/paged-response';
import axios from 'axios';

const AGENTS_BASE_URL = '/api/agents';

const agentsService = {
    list: async (request: PagedRequest) => {
        const response = await axios.get<PagedResponse<Agent>>(
            AGENTS_BASE_URL,
            {
                params: request,
            }
        );
        return response.data;
    },

    getById: async (id: string) => {
        const response = await axios.get<Agent>(`${AGENTS_BASE_URL}/${id}`);
        return response.data;
    },

    create: async (agent: Agent) => {
        const response = await axios.post<Agent>(AGENTS_BASE_URL, agent);
        return response.data;
    },

    update: async (id: string, agent: Agent) => {
        const response = await axios.put<Agent>(`${AGENTS_BASE_URL}/${id}`, agent);
        return response.data;
    },

    delete: async (id: string) => {
        const response = await axios.delete<Agent>(`${AGENTS_BASE_URL}/${id}`);
        return response.data;
    },
};

export default agentsService;
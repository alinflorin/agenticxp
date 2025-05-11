import { McpServer } from '@/shared-schemas/mcp-server';
import { PagedRequest } from '@/shared-schemas/paged-request';
import { PagedResponse } from '@/shared-schemas/paged-response';
import axios from 'axios';

const MCPSERVERS_BASE_URL = '/api/mcpServers';

const mcpServersService = {
    list: async (request: PagedRequest) => {
        const response = await axios.get<PagedResponse<McpServer>>(
            MCPSERVERS_BASE_URL,
            {
                params: request
            }
        );
        return response.data;
    },

    getById: async (id: string) => {
        const response = await axios.get<McpServer>(`${MCPSERVERS_BASE_URL}/${id}`);
        return response.data;
    },

    create: async (mcpServer: McpServer) => {
        const response = await axios.post<McpServer>('/api/mcp-servers', mcpServer); // Use the correct endpoint
        return response.data;
    },

    update: async (id: string, mcpServer: McpServer) => {
        const response = await axios.put<McpServer>(`${MCPSERVERS_BASE_URL}/${id}`, mcpServer);
        return response.data;
    },

    delete: async (id: string) => {
        const response = await axios.delete<McpServer>(`${MCPSERVERS_BASE_URL}/${id}`);
        return response.data;
    },
};

export default mcpServersService;
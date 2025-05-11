import { Connection } from '@/shared-schemas/connection'; // Assuming you have a Connection schema
import { PagedRequest } from '@/shared-schemas/paged-request';
import { PagedResponse } from '@/shared-schemas/paged-response';
import axios from 'axios';

const CONNECTIONS_BASE_URL = '/api/connections';

const connectionsService = {
    list: async (request: PagedRequest) => {
        const response = await axios.get<PagedResponse<Connection>>(
            CONNECTIONS_BASE_URL,
            {
                params: request,
            }
        );
        return response.data;
    },

    getById: async (id: string) => {
        const response = await axios.get<Connection>(`${CONNECTIONS_BASE_URL}/${id}`);
        return response.data;
    },

    create: async (connection: Connection) => {
        const response = await axios.post<Connection>(CONNECTIONS_BASE_URL, connection);
        return response.data;
    },

    update: async (id: string, connection: Connection) => {
        const response = await axios.put<Connection>(`${CONNECTIONS_BASE_URL}/${id}`, connection);
        return response.data;
    },

    delete: async (id: string) => {
        const response = await axios.delete<Connection>(`${CONNECTIONS_BASE_URL}/${id}`);
        return response.data;
    },
};

export default connectionsService;
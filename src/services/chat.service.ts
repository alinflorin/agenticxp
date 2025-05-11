import { Chat } from '@/shared-schemas/chat';
import { PagedRequest } from '@/shared-schemas/paged-request';
import { PagedResponse } from '@/shared-schemas/paged-response';
import axios from 'axios';

const CHATS_BASE_URL = '/api/chats';

const chatsService = {
    list: async (request: PagedRequest) => {
        const response = await axios.get<PagedResponse<Chat>>(
            CHATS_BASE_URL,
            {
                params: request,
            }
        );
        return response.data;
    },

    getById: async (id: string) => {
        const response = await axios.get<Chat>(`${CHATS_BASE_URL}/${id}`);
        return response.data;
    },

    create: async (chat: Chat) => {
        const response = await axios.post<Chat>(CHATS_BASE_URL, chat);
        return response.data;
    },

    update: async (id: string, chat: Chat) => {
        const response = await axios.put<Chat>(`${CHATS_BASE_URL}/${id}`, chat);
        return response.data;
    },

    delete: async (id: string) => {
        const response = await axios.delete<Chat>(`${CHATS_BASE_URL}/${id}`);
        return response.data;
    },
};

export default chatsService;
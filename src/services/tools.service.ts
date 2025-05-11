import { Tool } from '@/shared-schemas/tool';
import axios from 'axios';

const TOOLS_BASE_URL = '/api/tools';

const toolsService = {
    get: async () => {
        const response = await axios.get<Tool[]>(TOOLS_BASE_URL);
        return response.data;
    },
};

export default toolsService;
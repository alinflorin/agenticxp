import { Connection } from "@/shared-schemas/connection";
import axios from "axios";
import { GetModelsResponse } from "../models/openai/get-models-response";

export const connectionService = {
    getAllModels: async (con: Connection) => {
        const allModels = await axios.get<GetModelsResponse>(con.apiBaseUrl + `/models`, {
            headers: {
                Authorization: con.apiKey ? `Bearer ${con.apiKey}` : undefined
            }
        });
        return allModels.data;
    },
    validate: async (con: Connection) => {
        try {
            await connectionService.getAllModels(con);
            return true;
        } catch {
            return false;
        }
    },
};
export default connectionService;
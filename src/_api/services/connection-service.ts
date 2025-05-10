import { Connection } from "@/shared-schemas/connection";
import axios from "axios";
import { GetModelsResponse } from "../models/openai/get-models-response";

export default class ConnectionService {
    constructor(private _model: Connection) {}

    async getAllModels() {
        const allModels = await axios.get<GetModelsResponse>(
            this._model.apiBaseUrl + `/models`,
            {
                headers: {
                    Authorization: this._model.apiKey
                        ? `Bearer ${this._model.apiKey}`
                        : undefined,
                },
            }
        );
        return allModels.data;
    }

    async validate() {
        try {
            await this.getAllModels();
            return true;
        } catch {
            return false;
        }
    }
}

import { BaseEntityModel } from "./base-entity-model";
import { ModelParams } from "./model-params";
import { Tool } from "./tool";

export interface Agent extends BaseEntityModel {
        name: string;
        connectionId: string;
        model: string;
        systemPrompt: string;
        params?: ModelParams;
        streaming: boolean;
        tools?: Tool[];
}
import { BaseEntityModel } from "./base-entity-model";

export interface McpServer extends BaseEntityModel {
    type: string;
    command?: string;
    envVars?: {[key: string]: string};
    sseUrl?: string;
    sseApiHeaderAuth?: string;
}
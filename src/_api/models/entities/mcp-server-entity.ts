import { BaseEntity } from "./base-entity";

export interface McpServerEntity extends BaseEntity {
    name: string;
    userEmail: string;
    type: string;
    command?: string;
    envVars?: object;
    sseUrl?: string;
    sseApiHeaderAuth?: string;
    args?: string[];
}
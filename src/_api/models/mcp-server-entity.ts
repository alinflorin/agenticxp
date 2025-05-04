import { BaseEntity } from "./base-entity";

export interface McpServerEntity extends BaseEntity {
    userEmail: string;
    type: string;
    command?: string;
    envVars?: {[key: string]: string};
    sseUrl?: string;
    sseApiHeaderAuth?: string;
}
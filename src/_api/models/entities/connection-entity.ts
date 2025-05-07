import { BaseEntity } from "./base-entity";

export interface ConnectionEntity extends BaseEntity {
    name: string;
    userEmail: string;
    apiBaseUrl: string;
    apiKey?: string;
}
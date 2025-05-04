import { BaseEntityModel } from "./base-entity-model";

export interface Connection extends BaseEntityModel {
    name: string;
    apiBaseUrl: string;
    apiKey?: string;
}
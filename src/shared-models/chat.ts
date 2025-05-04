import { BaseEntityModel } from "./base-entity-model";

export interface Chat extends BaseEntityModel {
    title: string;
    agentId: string;
}
import { BaseEntity } from "./base-entity";

export interface ChatEntity extends BaseEntity {
    title: string;
    agentId: string;
}
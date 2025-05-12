import { ModelParams } from "@/shared-schemas/model-params";
import { BaseEntity } from "./base-entity";
import { Tool } from "@/shared-schemas/tool";

export interface AgentEntity extends BaseEntity {
    name: string;
    userEmail: string;
    connectionId: string;
    model: string;
    systemPrompt: string;
    params?: ModelParams;
    tools?: Tool[];
}
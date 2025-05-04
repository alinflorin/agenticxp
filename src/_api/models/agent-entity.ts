import { ModelParams } from "@/shared-models/model-params";
import { BaseEntity } from "./base-entity";
import { Tool } from "@/shared-models/tool";

export interface AgentEntity extends BaseEntity {
    name: string;
    userEmail: string;
    connectionId: string;
    model: string;
    systemPrompt: string;
    params?: ModelParams;
    streaming: boolean;
    tools?: Tool[];
}
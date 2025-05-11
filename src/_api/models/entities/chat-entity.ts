import { Message } from "@/shared-schemas/message";
import { BaseEntity } from "./base-entity";

export interface ChatEntity extends BaseEntity {
    userEmail: string;
    title: string;
    agentId: string;
    messages: Message[];
}
import { BaseEntity } from "./base-entity";

export interface MessageEntity extends BaseEntity {
    chatId: string;
    source: string;
    content: string;
}

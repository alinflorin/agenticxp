import { BaseEntityModel } from "./base-entity-model";

export interface Message extends BaseEntityModel {
    chatId: string;
    source: string;
    content: string;
}
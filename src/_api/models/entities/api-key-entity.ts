import { BaseEntity } from "./base-entity";

export interface ApiKeyEntity extends BaseEntity {
    userEmail: string;
    key: string;
}
import { ObjectId } from "mongodb";

export interface BaseEntity {
    _id?: ObjectId;
    createdDate: string;
    updatedDate?: string;
    createdBy: string;
    updatedBy?: string;
    isDeleted: boolean;
}
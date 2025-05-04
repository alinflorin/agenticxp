import { ObjectId } from "mongodb";

export interface BaseEntity {
    _id?: ObjectId;
    createdDate: Date;
    updatedDate?: Date;
    createdBy: string;
    updatedBy?: string;
    isDeleted: boolean;
}
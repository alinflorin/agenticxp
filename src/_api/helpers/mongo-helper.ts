import { BaseEntityModel } from "@/shared-models/base-entity-model";
import { BaseEntity } from "../models/base-entity";
import { ObjectId } from "mongodb";

export const toEntity = <TSource extends BaseEntityModel, TTarget extends BaseEntity>(source: TSource) => {
    const target = {
        _id: source._id ? new ObjectId(source._id) : undefined,
        createdBy: source.createdBy || "",
        createdDate: source.createdDate || new Date(),
        isDeleted: false,
        updatedBy: source.updatedBy,
        updatedDate: source.updatedDate
    } as TTarget;
    const sourceKeys = Object.keys(source);
    const targetKeys = Object.keys(target);
    const inSourceNotInTargetKeys = sourceKeys.filter(x => !targetKeys.includes(x));
    for (const k of inSourceNotInTargetKeys) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (target as any)[k] = (source as any)[k];
    }
    return target;
}

export const toModel = <TSource extends BaseEntity, TTarget extends BaseEntityModel>(source: TSource) => {
    const target = {
        _id: source._id ? source._id.toString() : undefined,
        createdBy: source.createdBy,
        createdDate: source.createdDate,
        updatedBy: source.updatedBy,
        updatedDate: source.updatedDate
    } as TTarget;
    const sourceKeys = Object.keys(source);
    const targetKeys = Object.keys(target);
    const inSourceNotInTargetKeys = sourceKeys.filter(x => !targetKeys.includes(x));
    for (const k of inSourceNotInTargetKeys) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (target as any)[k] = (source as any)[k];
    }
    return target;
}
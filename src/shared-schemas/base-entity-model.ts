import { BaseEntityModel } from "@/shared-models/base-entity-model";
import yup, { ObjectSchema } from "yup";
export const baseEntityModelSchema: ObjectSchema<BaseEntityModel> = yup
    .object({
        createdDate: yup
            .string()
            .optional()
            .label("ui.baseEntityModel.createdDate")
            .example(new Date().toISOString())
            .default(null),
        createdBy: yup
            .string()
            .optional()
            .label("ui.baseEntityModel.createdBy")
            .example("system")
            .default(null),
        updatedBy: yup
            .string()
            .optional()
            .label("ui.baseEntityModel.updatedBy")
            .example("system")
            .default(null),
        updatedDate: yup
            .string()
            .optional()
            .label("ui.baseEntityModel.updatedDate")
            .example(new Date().toISOString())
            .default(null),
        _id: yup
            .string()
            .optional()
            .label("ui.baseEntityModel.id")
            .example("id-here")
            .default(null),
    })
    .required();
export default baseEntityModelSchema;

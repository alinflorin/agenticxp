import yup from "yup";
export const baseEntityModelSchema = yup
    .object({
        createdDate: yup
            .string()
            .optional()
            .label("ui.baseEntityModel.createdDate")
            .example(new Date().toISOString()),
        createdBy: yup
            .string()
            .optional()
            .label("ui.baseEntityModel.createdBy")
            .example("system"),
        updatedBy: yup
            .string()
            .optional()
            .label("ui.baseEntityModel.updatedBy")
            .example("system"),
        updatedDate: yup
            .string()
            .optional()
            .label("ui.baseEntityModel.updatedDate")
            .example(new Date().toISOString()),
        _id: yup
            .string()
            .optional()
            .label("ui.baseEntityModel.id")
            .example("id-here"),
    })
    .required();
export default baseEntityModelSchema;
export type BaseEntityModel = yup.InferType<typeof baseEntityModelSchema>;
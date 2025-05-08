import yup from "yup";
export const baseEntityModelSchema = yup
    .object({
        createdDate: yup
            .string()
            .optional()
            .label("ui.baseEntityModel.createdDate"),
        createdBy: yup
            .string()
            .optional()
            .label("ui.baseEntityModel.createdBy"),
        updatedBy: yup
            .string()
            .optional()
            .label("ui.baseEntityModel.updatedBy"),
        updatedDate: yup
            .string()
            .optional()
            .label("ui.baseEntityModel.updatedDate"),
        _id: yup.string().optional().label("ui.baseEntityModel.id"),
    })
    .required()
    .jsonSchema((s) => ({
        ...s,
        default: {
            _id: "the-id",
            createdBy: "system",
            createdDate: new Date().toISOString(),
            updatedBy: "system",
            updatedDate: new Date().toISOString(),
        } as BaseEntityModel,
    }));
export default baseEntityModelSchema;
export type BaseEntityModel = yup.InferType<typeof baseEntityModelSchema>;

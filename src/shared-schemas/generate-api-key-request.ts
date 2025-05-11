import yup from "yup";

export const generateApiKeyRequestSchema = yup
    .object({
        expirationTs: yup.number().optional(),
    })
    .required()
    .jsonSchema((s) => ({
        ...s,
        default: {
            expirationTs: new Date().getTime() + 3600000,
        } as GenerateApiKeyRequest,
    }));
export default generateApiKeyRequestSchema;
export type GenerateApiKeyRequest = yup.InferType<
    typeof generateApiKeyRequestSchema
>;

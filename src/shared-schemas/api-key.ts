import yup from "yup";
import baseEntityModelSchema from "./base-entity-model";

export const apiKeySchema = baseEntityModelSchema
    .shape({
        key: yup
            .string()
            .required("ui.apiKey.keyIsRequired")
            .label("ui.apiKey.key"),
        expirationTs: yup.number().optional()
    })
    .jsonSchema((s) => ({
        ...s,
        default: {
            key: 'sk-some-key',
            expirationTs: new Date().getTime() + 3600000
        } as ApiKey,
    }));
export default apiKeySchema;
export type ApiKey = yup.InferType<typeof apiKeySchema>;

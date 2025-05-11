import yup from "yup";
import baseEntityModelSchema from "./base-entity-model";

export const apiKeySchema = baseEntityModelSchema
    .shape({
        key: yup
            .string()
            .required("ui.apiKey.keyIsRequired")
            .label("ui.apiKey.key"),
    })
    .jsonSchema((s) => ({
        ...s,
        default: {
            key: 'sk-some-key'
        } as ApiKey,
    }));
export default apiKeySchema;
export type ApiKey = yup.InferType<typeof apiKeySchema>;

import yup from "yup";
import baseEntityModelValidator from "./base-entity-model";

export const connectionSchema =
    baseEntityModelValidator.shape({
        name: yup
            .string()
            .required("ui.connection.nameIsRequired")
            .label("ui.connection.name"),
        apiBaseUrl: yup
            .string()
            .required("ui.connection.apiBaseUrlIsRequired")
            .url("ui.connection.apiBaseUrlIsInvalid")
            .label("ui.connection.apiBaseUrl"),
        apiKey: yup
            .string()
            .optional()
            .label("ui.connection.apiKey"),
    }).jsonSchema(s => ({...s, default: ({
        apiBaseUrl: 'https://api.openai.com/v1',
        apiKey: 'sk-xxxxxx',
        name: 'New Connection'
    } as Connection)}));

export default connectionSchema;
export type Connection = yup.InferType<typeof connectionSchema>;
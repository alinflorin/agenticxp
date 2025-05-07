import yup from "yup";
import baseEntityModelValidator from "./base-entity-model";

export const connectionSchema =
    baseEntityModelValidator.shape({
        name: yup
            .string()
            .required("ui.connection.nameIsRequired")
            .label("ui.connection.name")
            .example("New Connection"),
        apiBaseUrl: yup
            .string()
            .required("ui.connection.apiBaseUrlIsRequired")
            .url("ui.connection.apiBaseUrlIsInvalid")
            .label("ui.connection.apiBaseUrl")
            .example("https://api.openai.com/v1"),
        apiKey: yup
            .string()
            .optional()
            .label("ui.connection.apiKey")
            .example("sk-xxxxx"),
    });

export default connectionSchema;
export type Connection = yup.InferType<typeof connectionSchema>;
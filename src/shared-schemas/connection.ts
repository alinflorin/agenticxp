import { Connection } from "@/shared-models/connection";
import yup, { ObjectSchema } from "yup";
import baseEntityModelValidator from "./base-entity-model";

export const connectionSchema: ObjectSchema<Connection> =
    baseEntityModelValidator.shape({
        name: yup
            .string()
            .required("ui.connection.nameIsRequired")
            .label("ui.connection.name")
            .example("New Connection")
            .default(null),
        apiBaseUrl: yup
            .string()
            .required("ui.connection.apiBaseUrlIsRequired")
            .url("ui.connection.apiBaseUrlIsInvalid")
            .label("ui.connection.apiBaseUrl")
            .example("https://api.openai.com/v1")
            .default(null),
        apiKey: yup
            .string()
            .optional()
            .label("ui.connection.apiKey")
            .example("sk-xxxxx")
            .default(null),
    });

export default connectionSchema;

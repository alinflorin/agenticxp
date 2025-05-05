import { Connection } from "@/shared-models/connection";
import yup, { ObjectSchema } from "yup";
import baseEntityModelValidator from "./base-entity-model";

export const connectionSchema: ObjectSchema<Connection> =
    baseEntityModelValidator.shape({
        name: yup
            .string()
            .required("ui.connection.nameIsRequired")
            .label("ui.connection.name")
            .default("New Connection")
            .example("New Connection"),
        apiBaseUrl: yup
            .string()
            .required("ui.connection.apiBaseUrlIsRequired")
            .url("ui.connection.apiBaseUrlIsInvalid")
            .label("ui.connection.apiBaseUrl")
            .default("https://api.openai.com/v1")
            .example("https://api.openai.com/v1"),
        apiKey: yup.string().optional().label("ui.connection.apiKey").default("sk-xxxxx").example("sk-xxxxx"),
    });

export default connectionSchema;

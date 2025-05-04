import { Connection } from "@/shared-models/connection";
import yup, { ObjectSchema } from "yup";
import baseEntityModelValidator from "./base-entity-model-validator";

export const connectionValidator: ObjectSchema<Connection> = baseEntityModelValidator.shape({
    name: yup.string().required("validation.connection.nameIsRequired"),
    apiBaseUrl: yup.string().required("validation.connection.apiBaseUrlIsRequired").url("validation.connection.apiBaseUrlIsInvalid"),
    apiKey: yup.string().optional()
});

export default connectionValidator;
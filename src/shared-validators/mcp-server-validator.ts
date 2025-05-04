import { McpServer } from "@/shared-models/mcp-server";
import yup, { ObjectSchema } from "yup";
import baseEntityModelValidator from "./base-entity-model-validator";

export const mcpServerValidator: ObjectSchema<McpServer> =
    baseEntityModelValidator.shape({
        type: yup.string().required().oneOf(["stdio", "sse"]),
        command: yup
            .string()
            .when("type", (type, schema) =>
                type[0] && type[0] === "stdio"
                    ? schema.required("validation.mcpServer.commandIsRequired")
                    : schema.optional()
            ),
        envVars: yup
            .object()
            .optional()
            .test((value) => {
                if (value == null) return undefined;
                if (!Object.values(value).every((v) => typeof v === "string")) {
                    return new yup.ValidationError("validation.mcpServer.envVarsMustBeStrings")
                }
                return undefined;
            }),
        sseUrl: yup
            .string()
            .when("type", (type, schema) =>
                type[0] && type[0] === "sse"
                    ? schema.required("validation.mcpServer.sseUrlIsRequired").url("validation.mcpServer.sseUrlIsInvalid")
                    : schema.optional()
            ),
        sseApiHeaderAuth: yup
            .string()
            .when("type", (type, schema) =>
                type[0] && type[0] === "sse"
                    ? schema.optional()
                    : schema.notRequired()
            ),
    });

export default mcpServerValidator;

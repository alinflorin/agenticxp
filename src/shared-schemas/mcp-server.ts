import yup from "yup";
import baseEntityModelSchema from "./base-entity-model";

export const mcpServerSchema = baseEntityModelSchema
    .shape({
        name: yup
            .string()
            .required()
            .label("ui.mcpServer.name"),
        type: yup
            .string()
            .required()
            .oneOf(["stdio", "sse"])
            .label("ui.mcpServer.type"),
        command: yup
            .string()
            .when("type", (type, schema) =>
                type[0] && type[0] === "stdio"
                    ? schema
                          .required("ui.mcpServer.commandIsRequired")
                          .label("ui.mcpServer.command")
                    : schema.optional().label("ui.mcpServer.command")
            ),
        args: yup
            .array(yup.string().required())
            .optional()
            .label("ui.mcpServer.args"),
        envVars: yup
            .object()
            .noUnknown(false)
            .unknown(true)
            .optional()
            .test((value: unknown) => {
                if (!value) return true;
                if (!Object.values(value).every((v) => typeof v === "string")) {
                    return new yup.ValidationError(
                        "ui.mcpServer.envVarsMustBeStrings"
                    );
                }
                return true;
            })
            .label("ui.mcpServer.envVars"),
        sseUrl: yup
            .string()
            .when("type", (type, schema) =>
                type[0] && type[0] === "sse"
                    ? schema
                          .required("ui.mcpServer.sseUrlIsRequired")
                          .url("ui.mcpServer.sseUrlIsInvalid")
                          .label("ui.mcpServer.sseUrl")
                    : schema.optional().label("ui.mcpServer.sseUrl")
            ),
        sseApiHeaderAuth: yup
            .string()
            .when("type", (type, schema) =>
                type[0] && type[0] === "sse"
                    ? schema.optional().label("ui.mcpServer.sseApiHeaderAuth")
                    : schema
                          .notRequired()
                          .label("ui.mcpServer.sseApiHeaderAuth")
            ),
    })
    .jsonSchema((s) => ({
        ...s,
        default: {
            name: "n8n",
            type: "sse",
            sseApiHeaderAuth: "Bearer testKey",
            sseUrl: "https://n8n.internal.huna2.com/mcp/all/sse"
        } as McpServer,
    }));

export default mcpServerSchema;
export type McpServer = yup.InferType<typeof mcpServerSchema>;

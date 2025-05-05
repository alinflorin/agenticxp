import { McpServer } from "@/shared-models/mcp-server";
import yup, { ObjectSchema } from "yup";
import baseEntityModelSchema from "./base-entity-model";

export const mcpServerSchema: ObjectSchema<McpServer> =
    baseEntityModelSchema.shape({
        type: yup
            .string()
            .required()
            .oneOf(["stdio", "sse"])
            .label("ui.mcpServer.type")
            .example("sse")
            .default(null),
        command: yup
            .string()
            .when("type", (type, schema) =>
                type[0] && type[0] === "stdio"
                    ? schema
                          .required("ui.mcpServer.commandIsRequired")
                          .label("ui.mcpServer.command")
                          .example("npx -y @modelcontextprotocol/server-memory")
                          .default(null)
                    : schema
                          .optional()
                          .label("ui.mcpServer.command")
                          .example("npx -y @modelcontextprotocol/server-memory")
                          .default(null)
            ),
        envVars: yup
            .object()
            .optional()
            .test((value) => {
                if (value == null) return undefined;
                if (!Object.values(value).every((v) => typeof v === "string")) {
                    return new yup.ValidationError(
                        "ui.mcpServer.envVarsMustBeStrings"
                    );
                }
                return undefined;
            })
            .label("ui.mcpServer.envVars")
            .example({ SOME_ENV: "value" })
            .default(null),
        sseUrl: yup
            .string()
            .when("type", (type, schema) =>
                type[0] && type[0] === "sse"
                    ? schema
                          .required("ui.mcpServer.sseUrlIsRequired")
                          .url("ui.mcpServer.sseUrlIsInvalid")
                          .label("ui.mcpServer.sseUrl")
                          .example("https://n8n.internal.huna2.com/mcp/all/sse")
                          .default(null)
                    : schema
                          .optional()
                          .label("ui.mcpServer.sseUrl")
                          .example("https://n8n.internal.huna2.com/mcp/all/sse")
                          .default(null)
            ),
        sseApiHeaderAuth: yup
            .string()
            .when("type", (type, schema) =>
                type[0] && type[0] === "sse"
                    ? schema
                          .optional()
                          .label("ui.mcpServer.sseApiHeaderAuth")
                          .example("Bearer some-key")
                          .default(null)
                    : schema
                          .notRequired()
                          .label("ui.mcpServer.sseApiHeaderAuth")
                          .example("Bearer some-key")
                          .default(null)
            ),
    });

export default mcpServerSchema;

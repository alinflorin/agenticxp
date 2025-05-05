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
            .default("sse")
            .example("sse"),
        command: yup
            .string()
            .when("type", (type, schema) =>
                type[0] && type[0] === "stdio"
                    ? schema
                          .required("ui.mcpServer.commandIsRequired")
                          .label("ui.mcpServer.command")
                          .default("npx -y @modelcontextprotocol/server-memory")
                          .example("npx -y @modelcontextprotocol/server-memory")
                    : schema.optional().label("ui.mcpServer.command")
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
            .default({SOME_ENV: 'value'})
            .example({SOME_ENV: 'value'}),
        sseUrl: yup
            .string()
            .when("type", (type, schema) =>
                type[0] && type[0] === "sse"
                    ? schema
                          .required("ui.mcpServer.sseUrlIsRequired")
                          .url("ui.mcpServer.sseUrlIsInvalid").label("ui.mcpServer.sseUrl").default("https://n8n.internal.huna2.com/mcp/all/sse").example("https://n8n.internal.huna2.com/mcp/all/sse")
                    : schema.optional().label("ui.mcpServer.sseUrl").default("https://n8n.internal.huna2.com/mcp/all/sse").example("https://n8n.internal.huna2.com/mcp/all/sse")
            ),
        sseApiHeaderAuth: yup
            .string()
            .when("type", (type, schema) =>
                type[0] && type[0] === "sse"
                    ? schema.optional().label("ui.mcpServer.sseApiHeaderAuth").default("Bearer some-key").example("Bearer some-key")
                    : schema.notRequired().label("ui.mcpServer.sseApiHeaderAuth").default("Bearer some-key").example("Bearer some-key")
            ),
    });

export default mcpServerSchema;

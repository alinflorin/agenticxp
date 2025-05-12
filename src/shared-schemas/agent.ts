import yup from "yup";
import baseEntityModelSchema from "./base-entity-model";

const toolParameterSchema = yup
    .object({
        name: yup
            .string()
            .required("ui.agent.tool.toolParameter.nameIsRequired")
            .label("ui.agent.tool.toolParameter.name"),
        type: yup
            .string()
            .required("ui.agent.tool.toolParameter.typeIsRequired")
            .oneOf(
                [
                    "string",
                    "integer",
                    "float",
                    "number",
                    "boolean",
                    "json",
                    "array",
                ],
                "ui.agent.tool.toolParameter.typeIsInvalid"
            )
            .label("ui.agent.tool.toolParameter.type"),
        description: yup
            .string()
            .optional()
            .label("ui.agent.tool.toolParameter.description"),
        required: yup
            .boolean()
            .required("ui.agent.tool.toolParameter.requiredIsRequired")
            .label("ui.agent.tool.toolParameter.required"),
        defaultValue: yup
            .mixed()
            .optional()
            .label("ui.agent.tool.toolParameter.defaultValue"),
    })
    .required();

const toolSchema = yup
    .object({
        mcpServerId: yup
            .string()
            .required("ui.agent.tool.mcpServerIsRequired")
            .matches(/^[a-f\d]{24}$/i, "ui.agent.tool.mcpServerIsInvalid")
            .label("ui.agent.tool.mcpServer"),
        name: yup
            .string()
            .required("ui.agent.tool.nameIsRequired")
            .label("ui.agent.tool.name"),
        description: yup.string().optional().label("ui.agent.tool.description"),
        parameters: yup
            .array(toolParameterSchema)
            .optional()
            .label("ui.agent.tool.parameters"),
    })
    .required();

export const agentSchema = baseEntityModelSchema
    .shape({
        name: yup
            .string()
            .required("ui.agent.nameIsRequired")
            .label("ui.agent.name"),
        connectionId: yup
            .string()
            .required("ui.agent.connectionIsRequired")
            .matches(/^[a-f\d]{24}$/i, "ui.agent.connectionIsInvalid")
            .label("ui.agent.connection"),
        model: yup
            .string()
            .required("ui.agent.modelIsRequired")
            .label("ui.agent.model"),
        systemPrompt: yup
            .string()
            .required("ui.agent.systemPromptIsRequired")
            .label("ui.agent.systemPrompt"),
        params: yup
            .object({
                topP: yup
                    .number()
                    .optional()
                    .label("ui.agent.modelParams.topP"),
                topK: yup
                    .number()
                    .optional()
                    .label("ui.agent.modelParams.topK"),
                temperature: yup
                    .number()
                    .optional()
                    .label("ui.agent.modelParams.temperature"),
                timeout: yup
                    .number()
                    .optional()
                    .label("ui.agent.modelParams.timeout"),
            })
            .optional()
            .label("ui.agent.params"),
        tools: yup.array(toolSchema).optional().label("ui.agent.tools"),
    })
    .jsonSchema((s) => ({
        ...s,
        default: {
            connectionId: "connection-id",
            model: "models/gemini-2.0-flash",
            name: "My Agent",
            streaming: true,
            systemPrompt: "You are a...",
            tools: [
                {
                    mcpServerId: "mcp-server-id",
                    name: "get_weather",
                    description: "Can be used to get the weather",
                    parameters: [
                        {
                            name: "cityName",
                            required: true,
                            type: "string",
                            description: "The city name",
                        },
                    ],
                },
            ],
            params: {
                temperature: 1,
                timeout: 120000,
                topK: 0.4,
                topP: 0.95,
            },
        } as Agent,
    }));

export default agentSchema;
export type Agent = yup.InferType<typeof agentSchema>;
export type Tool = yup.InferType<typeof toolSchema>;
export type ToolParameter = yup.InferType<typeof toolParameterSchema>;

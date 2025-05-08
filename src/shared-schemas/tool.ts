import yup from "yup";
import toolParameterSchema from "./tool-parameter";

export const toolSchema = yup
    .object({
        mcpServerId: yup
            .string()
            .required("ui.tool.mcpServerIsRequired")
            .matches(/^[a-f\d]{24}$/i, "ui.tool.mcpServerIsInvalid")
            .label("ui.tool.mcpServer"),
        name: yup
            .string()
            .required("ui.tool.nameIsRequired")
            .label("ui.tool.name"),
        description: yup
            .string()
            .optional()
            .label("ui.tool.description"),
        parameters: yup
            .array(toolParameterSchema)
            .optional()
            .label("ui.tool.parameters"),
    })
    .required().jsonSchema(s => ({...s, default: ({
            mcpServerId: 'mcp-server-id',
            name: 'get_weather',
            description: 'Can be used to get the weather',
            parameters: [
                toolParameterSchema.spec.meta!.jsonSchema.default
            ]
        } as Tool)}));

export default toolSchema;
export type Tool = yup.InferType<typeof toolSchema>;
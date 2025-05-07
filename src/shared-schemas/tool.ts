import yup from "yup";
import toolParameterSchema from "./tool-parameter";

export const toolSchema = yup
    .object({
        mcpServerId: yup
            .string()
            .required("ui.tool.mcpServerIsRequired")
            .matches(/^[a-f\d]{24}$/i, "ui.tool.mcpServerIsInvalid")
            .label("ui.tool.mcpServer")
            .example("mcp-server-id"),
        name: yup
            .string()
            .required("ui.tool.nameIsRequired")
            .label("ui.tool.name")
            .example("get_weather"),
        description: yup
            .string()
            .optional()
            .label("ui.tool.description")
            .example("Some description"),
        parameters: yup
            .array(toolParameterSchema)
            .optional()
            .label("ui.tool.parameters")
            .example([]),
    })
    .required();

export default toolSchema;
export type Tool = yup.InferType<typeof toolSchema>;
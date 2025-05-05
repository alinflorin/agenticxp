import { Tool } from "@/shared-models/tool";
import yup, { ObjectSchema } from "yup";
import toolParameterSchema from "./tool-parameter";

export const toolSchema: ObjectSchema<Tool> = yup.object({
    mcpServerId: yup
        .string()
        .required("ui.tool.mcpServerIsRequired")
        .matches(/^[a-f\d]{24}$/i, "ui.tool.mcpServerIsInvalid")
        .label("ui.tool.mcpServer")
        .default("mcp-server-id")
        .example("mcp-server-id"),
    name: yup
        .string()
        .required("ui.tool.nameIsRequired")
        .label("ui.tool.name")
        .default("get_weather")
        .example("get_weather"),
    description: yup.string().optional().label("ui.tool.description").default("Some description").example("Some description"),
    parameters: yup
        .array(toolParameterSchema)
        .optional()
        .label("ui.tool.parameters")
        .default([toolParameterSchema.getDefault()])
        .example([toolParameterSchema.getDefault()]),
});

export default toolSchema;

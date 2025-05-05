import { ToolParameter } from "@/shared-models/tool-parameter";
import yup, { ObjectSchema } from "yup";

export const toolParameterSchema: ObjectSchema<ToolParameter> = yup.object({
    name: yup
        .string()
        .required("ui.toolParameter.nameIsRequired")
        .label("ui.toolParameter.name")
        .default("get_weather")
        .example("get_weather"),
    type: yup
        .string()
        .required("ui.toolParameter.typeIsRequired")
        .oneOf(
            ["string", "number", "boolean", "json", "array"],
            "ui.toolParameter.typeIsInvalid"
        )
        .label("ui.toolParameter.type")
        .default("string")
        .example("string"),
    description: yup.string().optional().label("ui.toolParameter.description").default("Some description").example("Some description"),
    required: yup
        .boolean()
        .required("ui.toolParameter.requiredIsRequired")
        .label("ui.toolParameter.required")
        .default(true)
        .example(true),
    defaultValue: yup.mixed().optional().label("ui.toolParameter.defaultValue").default("default").example("default"),
});

export default toolParameterSchema;

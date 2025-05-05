import { ToolParameter } from "@/shared-models/tool-parameter";
import yup, { ObjectSchema } from "yup";

export const toolParameterSchema: ObjectSchema<ToolParameter> = yup
    .object({
        name: yup
            .string()
            .required("ui.toolParameter.nameIsRequired")
            .label("ui.toolParameter.name")
            .example("get_weather"),
        type: yup
            .string()
            .required("ui.toolParameter.typeIsRequired")
            .oneOf(
                ["string", "number", "boolean", "json", "array"],
                "ui.toolParameter.typeIsInvalid"
            )
            .label("ui.toolParameter.type")
            .example("string"),
        description: yup
            .string()
            .optional()
            .label("ui.toolParameter.description")
            .example("Some description"),
        required: yup
            .boolean()
            .required("ui.toolParameter.requiredIsRequired")
            .label("ui.toolParameter.required")
            .example(true),
        defaultValue: yup
            .mixed()
            .optional()
            .label("ui.toolParameter.defaultValue")
            .example("default"),
    })
    .required();

export default toolParameterSchema;

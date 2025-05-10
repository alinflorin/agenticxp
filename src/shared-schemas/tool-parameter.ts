import yup from "yup";

export const toolParameterSchema = yup
    .object({
        name: yup
            .string()
            .required("ui.toolParameter.nameIsRequired")
            .label("ui.toolParameter.name"),
        type: yup
            .string()
            .required("ui.toolParameter.typeIsRequired")
            .oneOf(
                ["string", "integer", "float", "number", "boolean", "json", "array"],
                "ui.toolParameter.typeIsInvalid"
            )
            .label("ui.toolParameter.type"),
        description: yup
            .string()
            .optional()
            .label("ui.toolParameter.description"),
        required: yup
            .boolean()
            .required("ui.toolParameter.requiredIsRequired")
            .label("ui.toolParameter.required"),
        defaultValue: yup
            .mixed()
            .optional()
            .label("ui.toolParameter.defaultValue"),
    })
    .required()
    .jsonSchema((s) => ({
        ...s,
        default: {
            name: "cityName",
            required: true,
            type: "string",
            description: "The city name",
        } as ToolParameter,
    }));

export default toolParameterSchema;
export type ToolParameter = yup.InferType<typeof toolParameterSchema>;

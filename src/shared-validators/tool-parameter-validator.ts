import { ToolParameter } from '@/shared-models/tool-parameter';
import yup, { ObjectSchema } from 'yup';

export const toolParameterValidator: ObjectSchema<ToolParameter> = yup.object({
    name: yup.string().required("validation.toolParameter.nameIsRequired"),
    type: yup.string().required("validation.toolParameter.typeIsRequired").oneOf(["string", "number", "boolean", "json", "array"], "validation.toolParameter.typeIsInvalid"),
    description: yup.string().optional(),
    required: yup.boolean().required("validation.toolParameter.requiredIsRequired"),
    defaultValue: yup.mixed().optional()
});

export default toolParameterValidator;
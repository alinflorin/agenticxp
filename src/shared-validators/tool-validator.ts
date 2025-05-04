import { Tool } from '@/shared-models/tool';
import yup, { ObjectSchema } from 'yup';
import toolParameterValidator from './tool-parameter-validator';

export const toolValidator: ObjectSchema<Tool> = yup.object({
    mcpServerId: yup.string().required("validation.tool.mcpServerIsRequired").matches(/^[a-f\d]{24}$/i, "validation.tool.mcpServerIsInvalid"),
    name: yup.string().required("validation.tool.nameIsRequired"),
    description: yup.string().optional(),
    parameters: yup.array(toolParameterValidator).optional()
});

export default toolValidator;
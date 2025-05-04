import { ModelParams } from '@/shared-models/model-params';
import yup, { ObjectSchema } from 'yup';
export const modelParamsValidator: ObjectSchema<ModelParams> = yup.object({
    topP: yup.number().optional(),
    topK: yup.number().optional(),
    temperature: yup.number().optional(),
    timeout: yup.number().optional()
});
export default modelParamsValidator;
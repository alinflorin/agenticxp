import { ModelParams } from '@/shared-models/model-params';
import yup, { ObjectSchema } from 'yup';
export const modelParamsSchema: ObjectSchema<ModelParams> = yup.object({
    topP: yup.number().optional().label("ui.modelParams.topP").default(0.4).example(0.4),
    topK: yup.number().optional().label("ui.modelParams.topK").default(0.4).example(0.4),
    temperature: yup.number().optional().label("ui.modelParams.temperature").default(1).example(1),
    timeout: yup.number().optional().label("ui.modelParams.timeout").default(60000).example(60000)
});
export default modelParamsSchema;
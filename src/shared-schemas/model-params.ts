import { ModelParams } from "@/shared-models/model-params";
import yup, { ObjectSchema } from "yup";
export const modelParamsSchema: ObjectSchema<ModelParams> = yup
    .object({
        topP: yup.number().optional().label("ui.modelParams.topP").example(0.4),
        topK: yup.number().optional().label("ui.modelParams.topK").example(0.4),
        temperature: yup
            .number()
            .optional()
            .label("ui.modelParams.temperature")
            .example(1),
        timeout: yup
            .number()
            .optional()
            .label("ui.modelParams.timeout")
            .example(60000),
    })
    .required();
export default modelParamsSchema;

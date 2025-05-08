import yup from "yup";
export const modelParamsSchema = yup
    .object({
        topP: yup.number().optional().label("ui.modelParams.topP"),
        topK: yup.number().optional().label("ui.modelParams.topK"),
        temperature: yup
            .number()
            .optional()
            .label("ui.modelParams.temperature"),
        timeout: yup.number().optional().label("ui.modelParams.timeout"),
    })
    .required()
    .jsonSchema((s) => ({
        ...s,
        default: {
            temperature: 1,
            timeout: 120000,
            topK: 0.4,
            topP: 0.95,
        } as ModelParams,
    }));
export default modelParamsSchema;
export type ModelParams = yup.InferType<typeof modelParamsSchema>;

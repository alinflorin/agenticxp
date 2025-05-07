import yup from "yup";

export const healthResponseSchema = yup.object({
    healthy: yup.boolean().required().example(true).label("ui.healthResponse.healthy"),
    version: yup.string().required().example("1.0.0").label("ui.healthResponse.version")
}).required();
export type HealthResponse = yup.InferType<typeof healthResponseSchema>;
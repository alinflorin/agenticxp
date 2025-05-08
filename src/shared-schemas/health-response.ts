import yup from "yup";

export const healthResponseSchema = yup
    .object({
        healthy: yup.boolean().required().label("ui.healthResponse.healthy"),
        version: yup.string().required().label("ui.healthResponse.version"),
    })
    .required()
    .jsonSchema((s) => ({
        ...s,
        default: {
            healthy: true,
            version: "1.8.9",
        } as HealthResponse,
    }));
export type HealthResponse = yup.InferType<typeof healthResponseSchema>;

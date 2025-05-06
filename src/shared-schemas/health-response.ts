import { HealthResponse } from "@/shared-models/health-response";
import yup, { ObjectSchema } from "yup";

export const healthResponseSchema: ObjectSchema<HealthResponse> = yup.object({
    healthy: yup.boolean().required().example(true).label("ui.healthResponse.healthy"),
    version: yup.string().required().example("1.0.0").label("ui.healthResponse.version")
}).required();
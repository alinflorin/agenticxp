import { ErrorResponse } from "@/shared-models/error-response";
import yup, { ObjectSchema } from "yup";

export const errorResponseSchema: ObjectSchema<ErrorResponse> = yup
    .object()
    .required();
export default errorResponseSchema;

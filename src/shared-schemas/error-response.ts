import yup from "yup";

const errorResponseSchema = yup
    .object()
    .required()
    .jsonSchema((s) => ({
        ...s,
        default: {
            "": ["ui.error.someError"],
        } as ErrorResponse,
    }));
export default errorResponseSchema;

export type ErrorResponse = { [key: string]: string[] };

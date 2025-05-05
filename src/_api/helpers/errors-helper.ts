import { ErrorResponse } from "@/shared-models/error-response";
import { FastifyError } from "fastify";
import { ValidationError } from "yup";

export const extractErrorResponseFromValidationError = (
    ve: ValidationError
) => {
    const errorDict: ErrorResponse = {};
    for (const i of ve.inner) {
        errorDict[i.path || ""] = i.errors;
    }
    return errorDict;
};

export const extractErrorResponseFromError = (ve: FastifyError) => {
    const errorDict: ErrorResponse = {};
    errorDict[""] = [ve.message || "An error has occurred"];
    return errorDict;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
import { PagedResponse } from "@/shared-models/paged-response";
import yup, { ObjectSchema } from "yup";

export default function buildPagedResponseSchema<T>(typeSchema: yup.ISchema<any, yup.AnyObject, any, any>) {
    const schema: ObjectSchema<PagedResponse<T>> = yup.object({
        data: yup.array(typeSchema).required().example([]).default([]),
        page: yup.number().required().example(1).default(null),
        elementsPerPage: yup.number().required().example(50).default(null),
        totalCount: yup.number().required().example(1000).default(null)
    }).required();
    return schema;
}


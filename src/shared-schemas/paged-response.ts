/* eslint-disable @typescript-eslint/no-explicit-any */
import { PagedResponse } from "@/shared-models/paged-response";
import yup, { ObjectSchema } from "yup";

export default function buildPagedResponseSchema<T>(typeSchema: yup.ISchema<any, yup.AnyObject, any, any>) {
    const schema: ObjectSchema<PagedResponse<T>> = yup.object({
        data: yup.array(typeSchema).required().example([]),
        page: yup.number().required().example(1),
        elementsPerPage: yup.number().required().example(50),
        totalCount: yup.number().required().example(1000)
    }).required();
    return schema;
}


/* eslint-disable @typescript-eslint/no-explicit-any */
import { PagedResponse } from "@/shared-models/paged-response";
import yup, { ObjectSchema } from "yup";

export default function buildPagedResponseSchema<T>(
    typeSchema: yup.ISchema<any, yup.AnyObject, any, any>
) {
    const schema: ObjectSchema<PagedResponse<T>> = yup
        .object({
            data: yup.array(typeSchema).required().default([]).example([]).label("ui.pagedResponse.data"),
            page: yup.number().required().example(1).default(1).label("ui.pagedResponse.page"),
            elementsPerPage: yup.number().required().example(50).default(50).label("ui.pagedResponse.elementsPerPage"),
            totalCount: yup.number().required().example(1000).label("ui.pagedResponse.totalCount"),
        })
        .required();
    return schema;
}

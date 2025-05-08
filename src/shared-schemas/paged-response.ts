/* eslint-disable @typescript-eslint/no-explicit-any */
import yup from "yup";

export default function buildPagedResponseSchema<T>(
    typeSchema: yup.ISchema<T, yup.AnyObject, any, any>
) {
    const schema = yup
        .object({
            data: yup
                .array(typeSchema)
                .required()
                .default([])
                .label("ui.pagedResponse.data"),
            page: yup
                .number()
                .required()
                .default(1)
                .label("ui.pagedResponse.page"),
            elementsPerPage: yup
                .number()
                .required()
                .default(50)
                .label("ui.pagedResponse.elementsPerPage"),
            totalCount: yup
                .number()
                .required()
                .label("ui.pagedResponse.totalCount"),
        })
        .required()
        .jsonSchema((s) => ({
            ...s,
            default: {
                data: [(typeSchema as any).spec.meta.jsonSchema.default],
                elementsPerPage: 50,
                page: 1,
                totalCount: 1000,
            } as PagedResponse<any>,
        }));
    return schema;
}

export type PagedResponse<T> = yup.InferType<
    ReturnType<typeof buildPagedResponseSchema<T>>
>;

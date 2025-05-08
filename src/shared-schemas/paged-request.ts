import yup from "yup";

export const pagedRequestSchema = yup
    .object({
        page: yup.number().optional().default(1).label("ui.pagedRequest.page"),
        elementsPerPage: yup
            .number()
            .optional()
            .default(50)
            .label("ui.pagedRequest.elementsPerPage"),
    })
    .required()
    .jsonSchema((s) => ({
        ...s,
        default: {
            elementsPerPage: 50,
            page: 1,
        } as PagedRequest,
    }));
export default pagedRequestSchema;
export type PagedRequest = yup.InferType<typeof pagedRequestSchema>;

import { PagedRequest } from "@/shared-models/paged-request";
import yup, { ObjectSchema } from "yup";

export const pagedRequestSchema: ObjectSchema<PagedRequest> = yup
    .object({
        page: yup.number().optional().default(1),
        elementsPerPage: yup.number().optional().default(50),
    })
    .required();
export default pagedRequestSchema;

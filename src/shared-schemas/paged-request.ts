import { PagedRequest } from "@/shared-models/paged-request";
import yup, { ObjectSchema } from "yup";

export const pagedRequestSchema: ObjectSchema<PagedRequest> = yup
    .object({
        page: yup.number().optional().default(1).label("ui.pagedRequest.page"),
        elementsPerPage: yup.number().optional().default(50).label("ui.pagedRequest.elementsPerPage"),
    })
    .required();
export default pagedRequestSchema;

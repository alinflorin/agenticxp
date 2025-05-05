import { BaseEntityModel } from '@/shared-models/base-entity-model';
import yup, { ObjectSchema } from 'yup';
export const baseEntityModelValidator: ObjectSchema<BaseEntityModel> = yup.object({
    createdDate: yup.date().optional(),
    createdBy: yup.string().optional(),
    updatedBy: yup.string().optional(),
    updatedDate: yup.date().optional(),
    _id: yup.string().optional()
}).required();
export default baseEntityModelValidator;
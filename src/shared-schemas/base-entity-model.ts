import { BaseEntityModel } from '@/shared-models/base-entity-model';
import yup, { ObjectSchema } from 'yup';
export const baseEntityModelSchema: ObjectSchema<BaseEntityModel> = yup.object({
    createdDate: yup.date().optional().label("ui.baseEntityModel.createdDate").example(new Date()),
    createdBy: yup.string().optional().label("ui.baseEntityModel.createdBy").example("system"),
    updatedBy: yup.string().optional().label("ui.baseEntityModel.updatedBy").example(new Date()),
    updatedDate: yup.date().optional().label("ui.baseEntityModel.updatedDate").example("system"),
    _id: yup.string().optional().label("ui.baseEntityModel.id").example("id-here")
}).required();
export default baseEntityModelSchema;
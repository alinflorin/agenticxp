import { Chat } from '@/shared-models/chat';
import yup, { ObjectSchema } from 'yup';
import baseEntityModelValidator from './base-entity-model-validator';

export const chatValidator: ObjectSchema<Chat> = baseEntityModelValidator.shape({
    title: yup.string().required("validation.chat.titleIsRequired"),
    agentId: yup.string().required("validation.chat.agentIsRequired").matches(/^[a-f\d]{24}$/i, "validation.chat.agentIsInvalid")
});
export default chatValidator;
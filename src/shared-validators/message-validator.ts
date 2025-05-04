import { Message } from '@/shared-models/message';
import yup, { ObjectSchema } from 'yup';
import baseEntityModelValidator from './base-entity-model-validator';

export const messageValidator: ObjectSchema<Message> = baseEntityModelValidator.shape({
    source: yup.string().required("validation.message.sourceIsRequired").oneOf(["ai", "human", "system", "tool"], "validation.message.sourceIsInvalid"),
    chatId: yup.string().required("validation.message.chatIsRequired").matches(/^[a-f\d]{24}$/i, "validation.message.chatIsInvalid"),
    content: yup.string().required("validation.message.contentIsRequired")
});
export default messageValidator;
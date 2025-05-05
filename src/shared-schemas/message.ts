import { Message } from "@/shared-models/message";
import yup, { ObjectSchema } from "yup";
import baseEntityModelSchema from "./base-entity-model";

export const messageSchema: ObjectSchema<Message> = baseEntityModelSchema.shape(
    {
        source: yup
            .string()
            .required("ui.message.sourceIsRequired")
            .oneOf(
                ["ai", "human", "system", "tool"],
                "ui.message.sourceIsInvalid"
            )
            .label("ui.message.source")
            .example("human")
            .default(null),
        chatId: yup
            .string()
            .required("ui.message.chatIsRequired")
            .matches(/^[a-f\d]{24}$/i, "ui.message.chatIsInvalid")
            .label("ui.message.chat")
            .example("chat-id")
            .default(null),
        content: yup
            .string()
            .required("ui.message.contentIsRequired")
            .label("ui.message.content")
            .example("Hi there")
            .default(null),
    }
);
export default messageSchema;

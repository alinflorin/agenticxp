import yup from "yup";
import baseEntityModelSchema from "./base-entity-model";

export const messageSchema = baseEntityModelSchema
    .shape({
        source: yup
            .string()
            .required("ui.message.sourceIsRequired")
            .oneOf(
                ["ai", "human", "system", "tool"],
                "ui.message.sourceIsInvalid"
            )
            .label("ui.message.source"),
        chatId: yup
            .string()
            .required("ui.message.chatIsRequired")
            .matches(/^[a-f\d]{24}$/i, "ui.message.chatIsInvalid")
            .label("ui.message.chat"),
        content: yup
            .string()
            .required("ui.message.contentIsRequired")
            .label("ui.message.content"),
    })
    .jsonSchema((s) => ({
        ...s,
        default: {
            chatId: "chat-id",
            content: "Hi!",
            source: "human",
        } as Message,
    }));

export default messageSchema;
export type Message = yup.InferType<typeof messageSchema>;

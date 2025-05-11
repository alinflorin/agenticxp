import yup from "yup";
import baseEntityModelSchema from "./base-entity-model";
import messageSchema from "./message";

export const chatSchema = baseEntityModelSchema
    .shape({
        title: yup
            .string()
            .required("ui.chat.titleIsRequired")
            .label("ui.chat.title"),
        agentId: yup
            .string()
            .required("ui.chat.agentIsRequired")
            .matches(/^[a-f\d]{24}$/i, "ui.chat.agentIsInvalid")
            .label("ui.chat.agent"),
        messages: yup
            .array(messageSchema)
            .required("ui.chat.messagesAreRequired")
            .min(1, "ui.chat.messagesAreRequired"),
    })
    .jsonSchema((s) => ({
        ...s,
        default: {
            title: "New Chat",
            agentId: "agent-id",
            messages: [messageSchema.spec.meta!.jsonSchema.default],
        } as Chat,
    }));
export default chatSchema;
export type Chat = yup.InferType<typeof chatSchema>;

import yup from "yup";
import baseEntityModelSchema from "./base-entity-model";

export const chatSchema = baseEntityModelSchema
    .shape({
        title: yup
            .string()
            .required("ui.chat.titleIsRequired")
            .label("ui.chat.title"),
        reference: yup.string().optional().label("ui.chat.reference"),
        agentId: yup
            .string()
            .required("ui.chat.agentIsRequired")
            .matches(/^[a-f\d]{24}$/i, "ui.chat.agentIsInvalid")
            .label("ui.chat.agent"),
        messages: yup
            .array(
                yup
                    .object({
                        source: yup
                            .string()
                            .required("ui.chat.message.sourceIsRequired")
                            .oneOf(
                                ["ai", "human", "system", "tool"],
                                "ui.chat.message.sourceIsInvalid"
                            )
                            .label("ui.chat.message.source"),
                        content: yup
                            .string()
                            .required("ui.chat.message.contentIsRequired")
                            .label("ui.chat.message.content"),
                        sendDate: yup
                            .string()
                            .required("ui.chat.message.sendDateIsRequired")
                            .matches(
                                /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?$/,
                                "ui.chat.message.invalidSendDate"
                            )
                            .label("ui.chat.message.sendDate"),
                    })
                    .required()
            )
            .required("ui.chat.messagesAreRequired")
            .min(1, "ui.chat.messagesAreRequired"),
    })
    .jsonSchema((s) => ({
        ...s,
        default: {
            title: "New Chat",
            agentId: "agent-id",
            messages: [
                {
                    content: "Hi!",
                    source: "human",
                    sendDate: new Date().toISOString(),
                },
            ],
            reference: "my-reference",
        } as Chat,
    }));
export default chatSchema;
export type Chat = yup.InferType<typeof chatSchema>;

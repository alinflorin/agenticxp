import yup from "yup";

export const messageSchema = yup
    .object({
        source: yup
            .string()
            .required("ui.message.sourceIsRequired")
            .oneOf(
                ["ai", "human", "system", "tool"],
                "ui.message.sourceIsInvalid"
            )
            .label("ui.message.source"),
        content: yup
            .string()
            .required("ui.message.contentIsRequired")
            .label("ui.message.content"),
        sendDate: yup
            .string()
            .required("ui.message.sendDateIsRequired")
            .matches(
                /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?$/,
                "ui.message.invalidSendDate"
            )
            .label("ui.message.sendDate"),
    })
    .required()
    .jsonSchema((s) => ({
        ...s,
        default: {
            content: "Hi!",
            source: "human",
            sendDate: new Date().toISOString()
        } as Message,
    }));

export default messageSchema;
export type Message = yup.InferType<typeof messageSchema>;

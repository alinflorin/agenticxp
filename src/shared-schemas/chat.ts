import yup from "yup";
import baseEntityModelSchema from "./base-entity-model";

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
    })
    .jsonSchema((s) => ({
        ...s,
        default: {
            title: "New Chat",
            agentId: "agent-id",
        } as Chat,
    }));
export default chatSchema;
export type Chat = yup.InferType<typeof chatSchema>;

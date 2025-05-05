import { Chat } from "@/shared-models/chat";
import yup, { ObjectSchema } from "yup";
import baseEntityModelSchema from "./base-entity-model";

export const chatSchema: ObjectSchema<Chat> = baseEntityModelSchema.shape({
    title: yup
        .string()
        .required("ui.chat.titleIsRequired")
        .label("ui.chat.title")
        .example("New Chat"),
    agentId: yup
        .string()
        .required("ui.chat.agentIsRequired")
        .matches(/^[a-f\d]{24}$/i, "ui.chat.agentIsInvalid")
        .label("ui.chat.agent")
        .example("agent-id"),
});
export default chatSchema;

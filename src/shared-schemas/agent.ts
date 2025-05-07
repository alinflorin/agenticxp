import yup from "yup";
import baseEntityModelSchema from "./base-entity-model";
import modelParamsValidator from "./model-params";
import toolSchema from "./tool";

export const agentSchema = baseEntityModelSchema.shape({
    name: yup
        .string()
        .required("ui.agent.nameIsRequired")
        .label("ui.agent.name")
        .example("New Agent"),
    connectionId: yup
        .string()
        .required("ui.agent.connectionIsRequired")
        .matches(/^[a-f\d]{24}$/i, "ui.agent.connectionIsInvalid")
        .label("ui.agent.connection")
        .example("conn-id"),
    model: yup
        .string()
        .required("ui.agent.modelIsRequired")
        .label("ui.agent.model")
        .example("models/gemini-2.0-flash"),
    systemPrompt: yup
        .string()
        .required("ui.agent.systemPromptIsRequired")
        .label("ui.agent.systemPrompt")
        .example("You are a..."),
    params: modelParamsValidator
        .optional()
        .label("ui.agent.params"),
    streaming: yup
        .boolean()
        .required("ui.agent.streamingIsRequired")
        .label("ui.agent.streaming")
        .example(true),
    tools: yup
        .array(toolSchema)
        .optional()
        .label("ui.agent.tools")
        .example([]),
});

export default agentSchema;
export type Agent = yup.InferType<typeof agentSchema>;
import { Agent } from "@/shared-models/agent";
import yup, { ObjectSchema } from "yup";
import baseEntityModelSchema from "./base-entity-model";
import modelParamsValidator from "./model-params";
import toolSchema from "./tool";

export const agentSchema: ObjectSchema<Agent> = baseEntityModelSchema.shape({
    name: yup
        .string()
        .required("ui.agent.nameIsRequired")
        .label("ui.agent.name")
        .example("New Agent")
        .default(null),
    connectionId: yup
        .string()
        .required("ui.agent.connectionIsRequired")
        .matches(/^[a-f\d]{24}$/i, "ui.agent.connectionIsInvalid")
        .label("ui.agent.connection")
        .example("conn-id")
        .default(null),
    model: yup
        .string()
        .required("ui.agent.modelIsRequired")
        .label("ui.agent.model")
        .example("models/gemini-2.0-flash")
        .default(null),
    systemPrompt: yup
        .string()
        .required("ui.agent.systemPromptIsRequired")
        .label("ui.agent.systemPrompt")
        .example("You are a...")
        .default(null),
    params: modelParamsValidator
        .optional()
        .label("ui.agent.params")
        .default(null),
    streaming: yup
        .boolean()
        .required("ui.agent.streamingIsRequired")
        .label("ui.agent.streaming")
        .example(true)
        .default(null),
    tools: yup
        .array(toolSchema)
        .optional()
        .label("ui.agent.tools")
        .example([])
        .default([]),
});

export default agentSchema;

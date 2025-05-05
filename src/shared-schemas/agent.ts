import { Agent } from "@/shared-models/agent";
import yup, { ObjectSchema } from "yup";
import baseEntityModelSchema from "./base-entity-model";
import modelParamsValidator from "./model-params";
import toolValidator, { toolSchema } from "./tool";

export const agentSchema: ObjectSchema<Agent> = baseEntityModelSchema.shape({
    name: yup
        .string()
        .required("ui.agent.nameIsRequired")
        .label("ui.agent.name")
        .example("New Agent")
        .default("New Agent"),
    connectionId: yup
        .string()
        .required("ui.agent.connectionIsRequired")
        .matches(/^[a-f\d]{24}$/i, "ui.agent.connectionIsInvalid")
        .label("ui.agent.connection")
        .default("conn-id")
        .example("conn-id"),
    model: yup
        .string()
        .required("ui.agent.modelIsRequired")
        .label("ui.agent.model")
        .default("models/gemini-2.0-flash")
        .example("models/gemini-2.0-flash"),
    systemPrompt: yup
        .string()
        .required("ui.agent.systemPromptIsRequired")
        .label("ui.agent.systemPrompt")
        .default("You are a...")
        .example("You are a..."),
    params: modelParamsValidator.optional().label("ui.agent.params"),
    streaming: yup
        .boolean()
        .required("ui.agent.streamingIsRequired")
        .label("ui.agent.streaming")
        .default(true)
        .example(true),
    tools: yup.array(toolValidator).optional().label("ui.agent.tools").default([toolSchema.getDefault()]).example([toolSchema.getDefault()]),
});

export default agentSchema;

import yup from "yup";
import baseEntityModelSchema from "./base-entity-model";
import modelParamsValidator, { modelParamsSchema } from "./model-params";
import toolSchema from "./tool";

export const agentSchema = baseEntityModelSchema
    .shape({
        name: yup
            .string()
            .required("ui.agent.nameIsRequired")
            .label("ui.agent.name"),
        connectionId: yup
            .string()
            .required("ui.agent.connectionIsRequired")
            .matches(/^[a-f\d]{24}$/i, "ui.agent.connectionIsInvalid")
            .label("ui.agent.connection"),
        model: yup
            .string()
            .required("ui.agent.modelIsRequired")
            .label("ui.agent.model"),
        systemPrompt: yup
            .string()
            .required("ui.agent.systemPromptIsRequired")
            .label("ui.agent.systemPrompt"),
        params: modelParamsValidator.optional().label("ui.agent.params"),
        tools: yup.array(toolSchema).optional().label("ui.agent.tools"),
    })
    .jsonSchema((s) => ({
        ...s,
        default: {
            connectionId: "connection-id",
            model: "models/gemini-2.0-flash",
            name: "My Agent",
            streaming: true,
            systemPrompt: "You are a...",
            tools: [toolSchema.spec.meta!.jsonSchema.default],
            params: modelParamsSchema.spec.meta!.jsonSchema.default,
        } as Agent,
    }));

export default agentSchema;
export type Agent = yup.InferType<typeof agentSchema>;

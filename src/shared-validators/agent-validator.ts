import { Agent } from "@/shared-models/agent";
import yup, { ObjectSchema } from "yup";
import baseEntityModelValidator from "./base-entity-model-validator";
import modelParamsValidator from "./model-params-validator";
import toolValidator from "./tool-validator";

export const agentValidator: ObjectSchema<Agent> = baseEntityModelValidator.shape({
    name: yup.string().required("validation.agent.nameIsRequired"),
    connectionId: yup.string().required("validation.agent.connectionIsRequired").matches(/^[a-f\d]{24}$/i, "validation.agent.connectionIsInvalid"),
    model: yup.string().required("validation.agent.modelIsRequired"),
    systemPrompt: yup.string().required("validation.agent.systemPromptIsRequired"),
    params: modelParamsValidator.optional(),
    streaming: yup.boolean().required("validation.agent.streamingIsRequired"),
    tools: yup.array(toolValidator).optional()
});

export default agentValidator;
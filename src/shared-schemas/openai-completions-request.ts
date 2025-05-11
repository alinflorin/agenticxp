import yup from "yup";
import openaiMessageSchema from "./openai-message";

export const openaiCompletionsRequestSchema = yup.object({
    model: yup.string().required("ui.openaiCompletionsRequest.modelIsRequired").label("ui.openaiCompletionsRequest.model"),
    instructions: yup.string().required("ui.openaiCompletionsRequest.instructionsAreRequired").label("ui.openaiCompletionsRequest.instructions"),
    messages: yup.array(openaiMessageSchema).required("ui.openaiCompletionsRequest.messagesAreRequired").min(1, "ui.openaiCompletionsRequest.messagesAreRequired"),
    stream: yup.boolean().required("ui.openaiCompletionsRequest.streamIsRequired")
}).required().jsonSchema((s) => ({
        ...s,
        default: {
            instructions: 'You are a...',
            messages: [openaiMessageSchema.spec.meta!.jsonSchema.default],
            model: 'some-agent-id',
            stream: true
        } as OpenAiCompletionsRequest,
    }));

export default openaiCompletionsRequestSchema;
export type OpenAiCompletionsRequest = yup.InferType<
    typeof openaiCompletionsRequestSchema
>;

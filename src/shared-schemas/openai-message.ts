import yup from 'yup';

export const openaiMessageSchema = yup.object({
    role: yup.string().required("ui.openaiMessage.roleIsRequired").label("ui.openaiMessage.role"),
    content: yup.string().required("ui.openaiMessage.contentIsRequired").label("ui.openaiMessage.content")
}).required().jsonSchema((s) => ({
        ...s,
        default: {
            content: 'Test',
            role: 'user'
        } as OpenAiMessage,
    }));
export default openaiMessageSchema;
export type OpenAiMessage = yup.InferType<typeof openaiMessageSchema>;
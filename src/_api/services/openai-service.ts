import { Agent } from "@/shared-schemas/agent";
import { Connection } from "@/shared-schemas/connection";
import { OpenAiCompletionsRequest } from "@/shared-schemas/openai-completions-request";
import { OpenAI } from 'openai';
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

export class OpenAiService {
    private _openAiClient: OpenAI;
    constructor(private _connection: Connection, private _agent: Agent) {
        this._openAiClient = new OpenAI({
            apiKey: this._connection.apiKey,
            baseURL: this._connection.apiBaseUrl,
            timeout: this._agent.params?.timeout
        });
    }

    async getResponse(model: OpenAiCompletionsRequest) {
        return await this._openAiClient.chat.completions.create({
            messages: model.messages.map(m => ({
                role: m.role,
                content: m.content
            } as ChatCompletionMessageParam)),
            stream: true,
            model: this._agent.model,
        });
    }

}
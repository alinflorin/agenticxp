import openaiCompletionsRequestSchema, {
    OpenAiCompletionsRequest,
} from "@/shared-schemas/openai-completions-request";
import { FastifyError, FastifyInstance, FastifyPluginAsync } from "fastify";
import { agentsCollection, connectionsCollection } from "../services/mongodb";
import { ObjectId } from "mongodb";
import { Agent } from "@/shared-schemas/agent";
import { Connection } from "@/shared-schemas/connection";
import { OpenAiService } from "../services/openai-service";

export const openaiRoute: FastifyPluginAsync = (
    fastify: FastifyInstance
): Promise<void> => {
    fastify.post(
        "/api/openai/v1/completions",
        {
            schema: {
                description: "Get completions",
                operationId: "openai_completions",
                summary: "Get completions",
                body: openaiCompletionsRequestSchema,
            },
        },
        async (req) => {
            const model = req.body as OpenAiCompletionsRequest;
            const foundAgent = await agentsCollection.findOne({
                _id: ObjectId.createFromHexString(model.model),
                isDeleted: false,
                userEmail: req.user!.email,
            });
            if (!foundAgent) {
                const err: FastifyError = {
                    statusCode: 404,
                    message: "Not found",
                    code: "not_found",
                    name: "NotFound",
                };
                throw err;
            }
            const foundConnection = await connectionsCollection.findOne({
                _id: ObjectId.createFromHexString(foundAgent.connectionId),
                isDeleted: false,
                userEmail: req.user!.email,
            });
            if (!foundConnection) {
                const err: FastifyError = {
                    statusCode: 404,
                    message: "Not found",
                    code: "not_found",
                    name: "NotFound",
                };
                throw err;
            }
            const agent: Agent = {
                connectionId: foundAgent.connectionId,
                model: foundAgent.model,
                name: foundAgent.name,
                streaming: foundAgent.streaming,
                systemPrompt: foundAgent.systemPrompt,
                _id: foundAgent._id!.toString(),
                createdBy: foundAgent.createdBy,
                createdDate: foundAgent.createdDate,
                params: foundAgent.params,
                tools: foundAgent.tools,
                updatedBy: foundAgent.updatedBy,
                updatedDate: foundAgent.updatedDate,
            };
            const connection: Connection = {
                apiBaseUrl: foundConnection.apiBaseUrl,
                name: foundConnection.name,
                _id: foundConnection._id!.toString(),
                apiKey: foundConnection.apiKey,
                createdBy: foundConnection.createdBy,
                createdDate: foundConnection.createdDate,
                updatedBy: foundConnection.updatedBy,
                updatedDate: foundConnection.updatedDate,
            };
            const svc = new OpenAiService(connection, agent);

            const x = await svc.getResponse(model);
            for await (const event of x) {
                console.log(event.choices);
            }
            return {};
        }
    );

    return Promise.resolve();
};

export default openaiRoute;

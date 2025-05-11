import { FastifyInstance, FastifyPluginAsync, FastifyError } from "fastify";
import { agentsCollection, connectionsCollection } from "../services/mongodb";
import buildPagedResponseSchema from "@/shared-schemas/paged-response";
import pagedRequestSchema from "@/shared-schemas/paged-request";
import { PagedRequest } from "@/shared-schemas/paged-request";
import { PagedResponse } from "@/shared-schemas/paged-response";
import yup from "yup";
import { ObjectId } from "mongodb";
import agentSchema, { Agent } from "@/shared-schemas/agent";
import { AgentEntity } from "../models/entities/agent-entity";

export const agentsRoute: FastifyPluginAsync = (
    fastify: FastifyInstance
): Promise<void> => {
    fastify.get(
        "/api/agents",
        {
            schema: {
                description: "List agents of the user",
                operationId: "agents_list",
                summary: "List agents of the user",
                response: {
                    200: buildPagedResponseSchema<Agent>(agentSchema),
                },
                querystring: pagedRequestSchema,
            },
        },
        async (req) => {
            const pagedReq = req.query as PagedRequest;
            const results = await agentsCollection
                .find({
                    userEmail: req.user!.email,
                    isDeleted: false,
                })
                .skip((pagedReq.page - 1) * pagedReq.elementsPerPage)
                .limit(pagedReq.elementsPerPage)
                .toArray();
            const totalCount = await agentsCollection.countDocuments({
                userEmail: req.user!.email,
                isDeleted: false,
            });
            const reply = {
                data: results.map(
                    (x) =>
                        ({
                            connectionId: x.connectionId,
                            model: x.model,
                            streaming: x.streaming,
                            systemPrompt: x.systemPrompt,
                            params: x.params,
                            tools: x.tools,
                            name: x.name,
                            _id: x._id.toString(),
                            createdBy: x.createdBy,
                            createdDate: x.createdDate,
                            updatedBy: x.updatedBy,
                            updatedDate: x.updatedDate,
                        } as Agent)
                ),
                elementsPerPage: pagedReq.elementsPerPage,
                page: pagedReq.page,
                totalCount: totalCount,
            } as PagedResponse<Agent>;
            return reply;
        }
    );

    fastify.get(
        "/api/agents/:id",
        {
            schema: {
                description: "Get agent by ID",
                operationId: "agents_getById",
                summary: "Get agent by id",
                response: {
                    200: agentSchema,
                },
                params: yup
                    .object({
                        id: yup.string().required(),
                    })
                    .required(),
            },
        },
        async (req) => {
            const { id } = req.params as { id: string };

            const found = await agentsCollection.findOne({
                userEmail: req.user!.email,
                isDeleted: false,
                _id: ObjectId.createFromHexString(id),
            });

            if (!found) {
                const err: FastifyError = {
                    statusCode: 404,
                    message: "Not found",
                    code: "not_found",
                    name: "NotFound",
                };
                throw err;
            }
            const x = found;
            return {
                connectionId: x.connectionId,
                model: x.model,
                streaming: x.streaming,
                systemPrompt: x.systemPrompt,
                params: x.params,
                tools: x.tools,
                name: x.name,
                _id: x._id.toString(),
                createdBy: x.createdBy,
                createdDate: x.createdDate,
                updatedBy: x.updatedBy,
                updatedDate: x.updatedDate,
            } as Agent;
        }
    );

    fastify.post(
        "/api/agents",
        {
            schema: {
                description: "Create an agent",
                operationId: "agents_create",
                summary: "Create an agent",
                body: agentSchema,
                response: {
                    200: agentSchema,
                },
            },
        },
        async (req) => {
            const agentModel = req.body as Agent;

            const valid =
                (await connectionsCollection.countDocuments({
                    userEmail: req.user!.email,
                    _id: ObjectId.createFromHexString(agentModel.connectionId),
                })) > 0;

            if (!valid) {
                const err: FastifyError = {
                    statusCode: 400,
                    message: "ui.agent.invalidConnection",
                    code: "agent_failed",
                    name: "Agent connection does not exist",
                };
                throw err;
            }

            const agentEntity: AgentEntity = {
                createdBy: req.user!.email,
                createdDate: new Date().toISOString(),
                isDeleted: false,
                userEmail: req.user!.email,
                name: agentModel.name,
                connectionId: agentModel.connectionId,
                model: agentModel.model,
                streaming: agentModel.streaming,
                systemPrompt: agentModel.systemPrompt,
                params: agentModel.params,
                tools: agentModel.tools,
            };
            await agentsCollection.insertOne(agentEntity);
            const x = agentEntity;
            return {
                connectionId: x.connectionId,
                model: x.model,
                streaming: x.streaming,
                systemPrompt: x.systemPrompt,
                params: x.params,
                tools: x.tools,
                name: x.name,
                _id: x._id!.toString(),
                createdBy: x.createdBy,
                createdDate: x.createdDate,
                updatedBy: x.updatedBy,
                updatedDate: x.updatedDate,
            } as Agent;
        }
    );

    fastify.put(
        "/api/agents/:id",
        {
            schema: {
                description: "Update an agent",
                operationId: "agents_update",
                summary: "Update an agent",
                body: agentSchema,
                response: {
                    200: agentSchema,
                },
                params: yup
                    .object({
                        id: yup.string().required(),
                    })
                    .required(),
            },
        },
        async (req) => {
            const { id } = req.params as { id: string };

            const found = await agentsCollection.findOne({
                userEmail: req.user!.email,
                isDeleted: false,
                _id: ObjectId.createFromHexString(id),
            });

            if (!found) {
                const err: FastifyError = {
                    statusCode: 404,
                    message: "Not found",
                    code: "not_found",
                    name: "NotFound",
                };
                throw err;
            }
            const agentModel = req.body as Agent;

            const valid =
                (await connectionsCollection.countDocuments({
                    userEmail: req.user!.email,
                    _id: ObjectId.createFromHexString(agentModel.connectionId),
                })) > 0;

            if (!valid) {
                const err: FastifyError = {
                    statusCode: 400,
                    message: "ui.agent.invalidConnection",
                    code: "agent_failed",
                    name: "Agent connection does not exist",
                };
                throw err;
            }

            const merged: AgentEntity = {
                ...found,
                name: agentModel.name,
                connectionId: agentModel.connectionId,
                model: agentModel.model,
                streaming: agentModel.streaming,
                systemPrompt: agentModel.systemPrompt,
                params: agentModel.params,
                tools: agentModel.tools,
                updatedBy: req.user!.email,
                updatedDate: new Date().toISOString(),
                _id: undefined,
            };

            await agentsCollection.replaceOne(
                {
                    _id: ObjectId.createFromHexString(id),
                    userEmail: req.user!.email,
                    isDeleted: false,
                },
                merged
            );
            const x = merged;
            return {
                connectionId: x.connectionId,
                model: x.model,
                streaming: x.streaming,
                systemPrompt: x.systemPrompt,
                params: x.params,
                tools: x.tools,
                name: x.name,
                _id: id,
                createdBy: x.createdBy,
                createdDate: x.createdDate,
                updatedBy: x.updatedBy,
                updatedDate: x.updatedDate,
            } as Agent;
        }
    );

    fastify.delete(
        "/api/agents/:id",
        {
            schema: {
                description: "Delete an agent",
                operationId: "agents_delete",
                summary: "Delete an agent",
                response: {
                    200: agentSchema,
                },
                params: yup
                    .object({
                        id: yup.string().required(),
                    })
                    .required(),
            },
        },
        async (req) => {
            const { id } = req.params as { id: string };

            const found = await agentsCollection.findOne({
                userEmail: req.user!.email,
                isDeleted: false,
                _id: ObjectId.createFromHexString(id),
            });

            if (!found) {
                const err: FastifyError = {
                    statusCode: 404,
                    message: "Not found",
                    code: "not_found",
                    name: "NotFound",
                };
                throw err;
            }

            await agentsCollection.updateOne(
                {
                    _id: ObjectId.createFromHexString(id),
                    userEmail: req.user!.email,
                    isDeleted: false,
                },
                {
                    $set: {
                        isDeleted: true,
                    },
                }
            );
            const x = found;
            return {
                connectionId: x.connectionId,
                model: x.model,
                streaming: x.streaming,
                systemPrompt: x.systemPrompt,
                params: x.params,
                tools: x.tools,
                name: x.name,
                _id: id,
                createdBy: x.createdBy,
                createdDate: x.createdDate,
                updatedBy: x.updatedBy,
                updatedDate: x.updatedDate,
            } as Agent;
        }
    );

    return Promise.resolve();
};

export default agentsRoute;

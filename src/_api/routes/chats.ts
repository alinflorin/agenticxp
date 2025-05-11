import { FastifyInstance, FastifyPluginAsync, FastifyError } from "fastify";
import {
    agentsCollection,
    chatsCollection,
} from "../services/mongodb";
import buildPagedResponseSchema from "@/shared-schemas/paged-response";
import pagedRequestSchema from "@/shared-schemas/paged-request";
import { PagedRequest } from "@/shared-schemas/paged-request";
import { PagedResponse } from "@/shared-schemas/paged-response";
import yup from "yup";
import { ObjectId } from "mongodb";
import chatSchema, { Chat } from "@/shared-schemas/chat";
import { ChatEntity } from "../models/entities/chat-entity";

export const chatsRoute: FastifyPluginAsync = (
    fastify: FastifyInstance
): Promise<void> => {
    fastify.get(
        "/api/chats",
        {
            schema: {
                description: "List chats of the user",
                operationId: "chats_list",
                summary: "List chats of the user",
                response: {
                    200: buildPagedResponseSchema<Chat>(chatSchema),
                },
                querystring: pagedRequestSchema,
            },
        },
        async (req) => {
            const pagedReq = req.query as PagedRequest;
            const results = await chatsCollection
                .find({
                    userEmail: req.user!.email,
                    isDeleted: false,
                })
                .skip((pagedReq.page - 1) * pagedReq.elementsPerPage)
                .limit(pagedReq.elementsPerPage)
                .toArray();
            const totalCount = await chatsCollection.countDocuments({
                userEmail: req.user!.email,
                isDeleted: false,
            });
            const reply = {
                data: results.map(
                    (x) =>
                        ({
                            agentId: x.agentId,
                            title: x.title,
                            _id: x._id.toString(),
                            createdBy: x.createdBy,
                            createdDate: x.createdDate,
                            updatedBy: x.updatedBy,
                            messages: x.messages,
                            updatedDate: x.updatedDate,
                            reference: x.reference
                        } as Chat)
                ),
                elementsPerPage: pagedReq.elementsPerPage,
                page: pagedReq.page,
                totalCount: totalCount,
            } as PagedResponse<Chat>;
            return reply;
        }
    );

    fastify.get(
        "/api/chats/:id",
        {
            schema: {
                description: "Get chat by ID",
                operationId: "chats_getById",
                summary: "Get chat by id",
                response: {
                    200: chatSchema,
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

            const found = await chatsCollection.findOne({
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
                agentId: x.agentId,
                title: x.title,
                _id: x._id.toString(),
                createdBy: x.createdBy,
                createdDate: x.createdDate,
                updatedBy: x.updatedBy,
                updatedDate: x.updatedDate,
                messages: x.messages,
                reference: x.reference
            } as Chat;
        }
    );

    fastify.post(
        "/api/chats",
        {
            schema: {
                description: "Create a chat",
                operationId: "chats_create",
                summary: "Create a chat",
                body: chatSchema,
                response: {
                    200: chatSchema,
                },
            },
        },
        async (req) => {
            const chatModel = req.body as Chat;

            const valid =
                (await agentsCollection.countDocuments({
                    userEmail: req.user!.email,
                    _id: ObjectId.createFromHexString(chatModel.agentId),
                })) > 0;

            if (!valid) {
                const err: FastifyError = {
                    statusCode: 400,
                    message: "ui.chat.agentIsInvalid",
                    code: "chat_failed",
                    name: "Chat agent does not exist",
                };
                throw err;
            }

            const chatEntity: ChatEntity = {
                createdBy: req.user!.email,
                createdDate: new Date().toISOString(),
                isDeleted: false,
                userEmail: req.user!.email,
                agentId: chatModel.agentId,
                title: chatModel.title,
                messages: chatModel.messages,
                reference: chatModel.reference
            };
            await chatsCollection.insertOne(chatEntity);
            const x = chatEntity;
            return {
                agentId: x.agentId,
                title: x.title,
                _id: x._id!.toString(),
                createdBy: x.createdBy,
                createdDate: x.createdDate,
                updatedBy: x.updatedBy,
                updatedDate: x.updatedDate,
                messages: x.messages,
                reference: x.reference
            } as Chat;
        }
    );

    fastify.put(
        "/api/chats/:id",
        {
            schema: {
                description: "Update a chat",
                operationId: "chats_update",
                summary: "Update a chat",
                body: chatSchema,
                response: {
                    200: chatSchema,
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

            const found = await chatsCollection.findOne({
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
            const chatModel = req.body as Chat;

            const valid =
                (await agentsCollection.countDocuments({
                    userEmail: req.user!.email,
                    _id: ObjectId.createFromHexString(chatModel.agentId),
                })) > 0;

            if (!valid) {
                const err: FastifyError = {
                    statusCode: 400,
                    message: "ui.chat.agentIsInvalid",
                    code: "chat_failed",
                    name: "Chat agent does not exist",
                };
                throw err;
            }

            const merged: ChatEntity = {
                ...found,
                agentId: chatModel.agentId,
                title: chatModel.title,
                updatedBy: req.user!.email,
                updatedDate: new Date().toISOString(),
                _id: undefined,
                messages: chatModel.messages,
                reference: chatModel.reference
            };

            await chatsCollection.replaceOne(
                {
                    _id: ObjectId.createFromHexString(id),
                    userEmail: req.user!.email,
                    isDeleted: false,
                },
                merged
            );
            const x = merged;
            return {
                agentId: x.agentId,
                title: x.title,
                _id: id,
                createdBy: x.createdBy,
                createdDate: x.createdDate,
                updatedBy: x.updatedBy,
                updatedDate: x.updatedDate,
                messages: x.messages,
                reference: x.reference
            } as Chat;
        }
    );

    fastify.delete(
        "/api/chats/:id",
        {
            schema: {
                description: "Delete a chat",
                operationId: "chats_delete",
                summary: "Delete a chat",
                response: {
                    200: chatSchema,
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

            const found = await chatsCollection.findOne({
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

            await chatsCollection.updateOne(
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
                agentId: x.agentId,
                title: x.title,
                _id: id,
                createdBy: x.createdBy,
                createdDate: x.createdDate,
                updatedBy: x.updatedBy,
                updatedDate: x.updatedDate,
                messages: x.messages,
                reference: x.reference
            } as Chat;
        }
    );

    return Promise.resolve();
};

export default chatsRoute;

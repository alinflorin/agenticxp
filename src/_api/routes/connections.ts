import { Connection } from "@/shared-schemas/connection";
import connectionSchema from "@/shared-schemas/connection";

import { FastifyInstance, FastifyPluginAsync, FastifyError } from "fastify";
import { ConnectionEntity } from "../models/connection-entity";
import { connectionsCollection } from "../services/mongodb";
import buildPagedResponseSchema from "@/shared-schemas/paged-response";
import pagedRequestSchema from "@/shared-schemas/paged-request";
import { PagedRequest } from "@/shared-schemas/paged-request";
import { PagedResponse } from "@/shared-schemas/paged-response";
import yup from "yup";
import { ObjectId } from "mongodb";

export const connectionsRoute: FastifyPluginAsync = (
    fastify: FastifyInstance
): Promise<void> => {
    fastify.get(
        "/api/connections",
        {
            schema: {
                description: "List connections of the user",
                operationId: "connections_list",
                summary: "List connections of the user",
                response: {
                    200: buildPagedResponseSchema<Connection>(connectionSchema),
                },
                querystring: pagedRequestSchema,
            },
        },
        async (req) => {
            const pagedReq = req.query as PagedRequest;
            const results = await connectionsCollection
                .find({
                    userEmail: req.user!.email,
                    isDeleted: false,
                })
                .skip((pagedReq.page - 1) * pagedReq.elementsPerPage)
                .limit(pagedReq.elementsPerPage)
                .toArray();
            const totalCount = await connectionsCollection.countDocuments({
                userEmail: req.user!.email,
                isDeleted: false,
            });
            const reply = {
                data: results.map(
                    (x) =>
                        ({
                            apiBaseUrl: x.apiBaseUrl,
                            name: x.name,
                            _id: x._id.toString(),
                            apiKey: x.apiKey,
                            createdBy: x.createdBy,
                            createdDate: x.createdDate,
                            updatedBy: x.updatedBy,
                            updatedDate: x.updatedDate,
                        } as Connection)
                ),
                elementsPerPage: pagedReq.elementsPerPage,
                page: pagedReq.page,
                totalCount: totalCount,
            } as PagedResponse<Connection>;
            return reply;
        }
    );

    fastify.get(
        "/api/connections/:id",
        {
            schema: {
                description: "Get connection by ID",
                operationId: "connections_getById",
                summary: "Get connection by id",
                response: {
                    200: connectionSchema,
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

            const found = await connectionsCollection.findOne({
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
                apiBaseUrl: x.apiBaseUrl,
                name: x.name,
                _id: x._id.toString(),
                apiKey: x.apiKey,
                createdBy: x.createdBy,
                createdDate: x.createdDate,
                updatedBy: x.updatedBy,
                updatedDate: x.updatedDate,
            } as Connection;
        }
    );

    fastify.post(
        "/api/connections",
        {
            schema: {
                description: "Create a connection",
                operationId: "connections_create",
                summary: "Create a connection",
                body: connectionSchema,
                response: {
                    200: connectionSchema,
                },
            },
        },
        async (req) => {
            const connectionModel = req.body as Connection;
            const connectionEntity: ConnectionEntity = {
                apiBaseUrl: connectionModel.apiBaseUrl,
                createdBy: req.user!.email,
                createdDate: new Date().toISOString(),
                isDeleted: false,
                userEmail: req.user!.email,
                name: connectionModel.name,
                apiKey: connectionModel.apiKey
            };
            await connectionsCollection.insertOne(connectionEntity);
            const x = connectionEntity;
            return {
                apiBaseUrl: x.apiBaseUrl,
                name: x.name,
                _id: x._id!.toString(),
                apiKey: x.apiKey,
                createdBy: x.createdBy,
                createdDate: x.createdDate,
            };
        }
    );

    fastify.put(
        "/api/connections/:id",
        {
            schema: {
                description: "Update a connection",
                operationId: "connections_update",
                summary: "Update a connection",
                body: connectionSchema,
                response: {
                    200: connectionSchema,
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

            const found = await connectionsCollection.findOne({
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
            const connectionModel = req.body as Connection;
            const merged: ConnectionEntity = {
                ...found,
                apiBaseUrl: connectionModel.apiBaseUrl,
                name: connectionModel.name,
                apiKey: connectionModel.apiKey,
                updatedBy: req.user!.email,
                updatedDate: new Date().toISOString(),
                _id: undefined,
            };
            
            await connectionsCollection.replaceOne(
                {
                    _id: ObjectId.createFromHexString(id),
                    userEmail: req.user!.email,
                    isDeleted: false,
                },
                merged
            );
            const x = merged;
            return {
                apiBaseUrl: x.apiBaseUrl,
                name: x.name,
                _id: x._id!.toString(),
                apiKey: x.apiKey,
                createdBy: x.createdBy,
                createdDate: x.createdDate,
                updatedBy: x.updatedBy,
                updatedDate: x.updatedDate,
            };
        }
    );

    fastify.delete(
        "/api/connections/:id",
        {
            schema: {
                description: "Delete a connection",
                operationId: "connections_delete",
                summary: "Delete a connection",
                response: {
                    200: connectionSchema,
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

            const found = await connectionsCollection.findOne({
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
            
            await connectionsCollection.updateOne(
                {
                    _id: ObjectId.createFromHexString(id),
                    userEmail: req.user!.email,
                    isDeleted: false,
                },
                {
                    $set: {
                        isDeleted: true
                    }
                }
            );
            const x = found;
            return {
                apiBaseUrl: x.apiBaseUrl,
                name: x.name,
                _id: x._id!.toString(),
                apiKey: x.apiKey,
                createdBy: x.createdBy,
                createdDate: x.createdDate,
                updatedBy: x.updatedBy,
                updatedDate: x.updatedDate,
            };
        }
    );

    return Promise.resolve();
};

export default connectionsRoute;

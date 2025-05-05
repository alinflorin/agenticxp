import { Connection } from "@/shared-models/connection";
import connectionSchema from "@/shared-schemas/connection";

import { FastifyInstance, FastifyPluginAsync, FastifyError } from "fastify";
import { toEntity, toModel } from "../helpers/mongo-helper";
import { ConnectionEntity } from "../models/connection-entity";
import { connectionsCollection } from "../services/mongodb";
import { PagedRequest } from "@/shared-models/paged-request";
import { PagedResponse } from "@/shared-models/paged-response";
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
                querystring: yup
                    .object({
                        page: yup.number().optional().default(1),
                        elementsPerPage: yup.number().optional().default(50),
                    })
                    .required(),
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
            return {
                data: results.map((x) => toModel(x) as Connection),
                elementsPerPage: pagedReq.elementsPerPage,
                page: pagedReq.page,
                totalCount: totalCount,
            } as PagedResponse<Connection>;
        }
    );

    fastify.get(
        "/api/connections/:id",
        {
            schema: {
                description: "Get connection by ID",
                operationId: "connections_getById",
                summary: "Get connection by id",
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
            return toModel(found);
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
            },
        },
        async (req) => {
            const connectionModel = req.body as Connection;
            const connectionEntity: ConnectionEntity =
                toEntity(connectionModel);
            connectionEntity.createdBy = req.user!.email;
            connectionEntity.createdDate = new Date().toISOString();
            connectionEntity.isDeleted = false;
            connectionEntity.updatedBy = undefined;
            connectionEntity.updatedDate = undefined;
            connectionEntity.userEmail = req.user!.email;
            await connectionsCollection.insertOne(connectionEntity);
            return toModel(connectionEntity);
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
                ...toEntity(connectionModel),
                _id: undefined,
            };
            merged.updatedBy = req.user!.email;
            merged.updatedDate = new Date().toISOString();
            await connectionsCollection.replaceOne(
                {
                    _id: ObjectId.createFromHexString(id),
                    userEmail: req.user!.email,
                    isDeleted: false,
                },
                merged
            );
            return toModel(merged);
        }
    );

    return Promise.resolve();
};

export default connectionsRoute;

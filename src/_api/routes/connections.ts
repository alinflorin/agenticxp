import { Connection } from "@/shared-models/connection";
import connectionSchema from "@/shared-schemas/connection";

import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { toEntity, toModel } from "../helpers/mongo-helper";
import { ConnectionEntity } from "../models/connection-entity";
import { connectionsCollection } from "../services/mongodb";
import buildPagedResponseSchema from "@/shared-schemas/paged-response";
import pagedRequestSchema from "@/shared-schemas/paged-request";
import { PagedRequest } from "@/shared-models/paged-request";
import { PagedResponse } from "@/shared-models/paged-response";

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
            return {
                data: results.map((x) => toModel(x) as Connection),
                elementsPerPage: pagedReq.elementsPerPage,
                page: pagedReq.page,
                totalCount: totalCount,
            } as PagedResponse<Connection>;
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

    return Promise.resolve();
};

export default connectionsRoute;

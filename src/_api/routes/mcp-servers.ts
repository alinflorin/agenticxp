import mcpServerSchema, { McpServer } from "@/shared-schemas/mcp-server";
import { FastifyError, FastifyInstance, FastifyPluginAsync } from "fastify";
import { McpServerEntity } from "../models/entities/mcp-server-entity";
import { mcpServersCollection } from "../services/mongodb";
import buildPagedResponseSchema, {
    PagedResponse,
} from "@/shared-schemas/paged-response";
import pagedRequestSchema, {
    PagedRequest,
} from "@/shared-schemas/paged-request";
import yup from "yup";
import { ObjectId } from "mongodb";
import { McpServerService } from "../services/mcpServer-service";

export const mcpServersRoute: FastifyPluginAsync = (
    fastify: FastifyInstance
): Promise<void> => {
    fastify.get(
        "/api/mcpServers",
        {
            schema: {
                description: "List MCP Servers of the user",
                operationId: "mcpservers_list",
                summary: "List MCP Servers of the user",
                response: {
                    200: buildPagedResponseSchema<McpServer>(mcpServerSchema),
                },
                querystring: pagedRequestSchema,
            },
        },
        async (req) => {
            const pagedReq = req.query as PagedRequest;
            const results = await mcpServersCollection
                .find({
                    userEmail: req.user!.email,
                    isDeleted: false,
                })
                .skip((pagedReq.page - 1) * pagedReq.elementsPerPage)
                .limit(pagedReq.elementsPerPage)
                .toArray();
            const totalCount = await mcpServersCollection.countDocuments({
                userEmail: req.user!.email,
                isDeleted: false,
            });
            const reply = {
                data: results.map(
                    (x) =>
                        ({
                            type: x.type,
                            _id: x._id!.toString(),
                            command: x.command,
                            createdBy: x.createdBy,
                            createdDate: x.createdDate,
                            envVars: x.envVars,
                            sseApiHeaderAuth: x.sseApiHeaderAuth,
                            sseUrl: x.sseUrl,
                            updatedBy: x.updatedBy,
                            updatedDate: x.updatedDate,
                            args: x.args,
                            name: x.name
                        } as McpServer)
                ),
                elementsPerPage: pagedReq.elementsPerPage,
                page: pagedReq.page,
                totalCount: totalCount,
            } as PagedResponse<McpServer>;
            return reply;
        }
    );

    fastify.get(
        "/api/mcpServers/:id",
        {
            schema: {
                description: "Get MCP Server by ID",
                operationId: "mcpservers_getById",
                summary: "Get MCP Server by id",
                response: {
                    200: mcpServerSchema,
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

            const found = await mcpServersCollection.findOne({
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
                type: x.type,
                command: x.command,
                envVars: x.envVars,
                sseApiHeaderAuth: x.sseApiHeaderAuth,
                sseUrl: x.sseUrl,
                _id: x._id.toString(),
                createdBy: x.createdBy,
                createdDate: x.createdDate,
                updatedBy: x.updatedBy,
                updatedDate: x.updatedDate,
                args: x.args,
                name: x.name
            } as McpServer;
        }
    );

    fastify.post(
        "/api/mcp-servers",
        {
            schema: {
                body: mcpServerSchema,
                response: {
                    200: mcpServerSchema,
                },
                description: "Register an MCP server",
                summary: "Register an MCP server",
                operationId: "mcpservers_create",
            },
        },
        async (req) => {
            const model = req.body as McpServer;

            const svc = new McpServerService(model);
            await svc.connect();
            const valid = await svc.validate();
            await svc.disconnect();
            
            if (!valid) {
                const err: FastifyError = {
                    statusCode: 400,
                    message: "ui.mcpServer.failed",
                    code: "mcpserver_failed",
                    name: "Connection to MCP Server failed",
                };
                throw err;
            }

            const mcpServerEntity: McpServerEntity = {
                createdBy: req.user!.email,
                createdDate: new Date().toISOString(),
                isDeleted: false,
                type: model.type,
                userEmail: req.user!.email,
                command: model.command,
                envVars: model.envVars,
                sseApiHeaderAuth: model.sseApiHeaderAuth,
                sseUrl: model.sseUrl,
                args: model.args,
                name: model.name
            };
            await mcpServersCollection.insertOne(mcpServerEntity);
            return {
                _id: mcpServerEntity._id!.toString(),
                type: mcpServerEntity.type,
                command: mcpServerEntity.command,
                createdBy: mcpServerEntity.createdBy,
                createdDate: mcpServerEntity.createdDate,
                envVars: mcpServerEntity.envVars,
                sseApiHeaderAuth: mcpServerEntity.sseApiHeaderAuth,
                sseUrl: mcpServerEntity.sseUrl,
                args: mcpServerEntity.args,
                name: mcpServerEntity.name
            } as McpServer;
        }
    );


    fastify.put(
        "/api/mcpServers/:id",
        {
            schema: {
                description: "Update an MCP Server",
                operationId: "mcpservers_update",
                summary: "Update an MCP Server",
                body: mcpServerSchema,
                response: {
                    200: mcpServerSchema,
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

            const found = await mcpServersCollection.findOne({
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
            const model = req.body as McpServer;

            const svc = new McpServerService(model);
            await svc.connect();
            const valid = await svc.validate();
            await svc.disconnect();

            if (!valid) {
                const err: FastifyError = {
                    statusCode: 400,
                    message: "ui.mcpServer.failed",
                    code: "mcpserver_failed",
                    name: "Connection to MCP Server failed",
                };
                throw err;
            }

            const merged: McpServerEntity = {
                ...found,
                type: model.type,
                command: model.command,
                envVars: model.envVars,
                sseApiHeaderAuth: model.sseApiHeaderAuth,
                sseUrl: model.sseUrl,
                updatedBy: req.user!.email,
                updatedDate: new Date().toISOString(),
                _id: undefined,
                args: model.args,
                name: model.name
            };
            
            await mcpServersCollection.replaceOne(
                {
                    _id: ObjectId.createFromHexString(id),
                    userEmail: req.user!.email,
                    isDeleted: false,
                },
                merged
            );
            const x = merged;
            return {
                type: x.type,
                command: x.command,
                envVars: x.envVars,
                sseApiHeaderAuth: x.sseApiHeaderAuth,
                sseUrl: x.sseUrl,
                _id: id,
                createdBy: x.createdBy,
                createdDate: x.createdDate,
                updatedBy: x.updatedBy,
                updatedDate: x.updatedDate,
                args: x.args,
                name: x.name
            } as McpServer;
        }
    );


    fastify.delete(
        "/api/mcpServers/:id",
        {
            schema: {
                description: "Delete an MCP Server",
                operationId: "mcpservers_delete",
                summary: "Delete an MCP Server",
                response: {
                    200: mcpServerSchema,
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

            const found = await mcpServersCollection.findOne({
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

            await mcpServersCollection.updateOne(
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
                type: x.type,
                command: x.command,
                envVars: x.envVars,
                sseApiHeaderAuth: x.sseApiHeaderAuth,
                sseUrl: x.sseUrl,
                _id: id,
                createdBy: x.createdBy,
                createdDate: x.createdDate,
                updatedBy: x.updatedBy,
                args: x.args,
                updatedDate: x.updatedDate,
                name: x.name
            } as McpServer;
        }
    );

    return Promise.resolve();
};

export default mcpServersRoute;

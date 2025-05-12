import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { mcpServersCollection } from "../services/mongodb";
import { McpServer } from "@/shared-schemas/mcp-server";
import { McpRunner } from "../services/mcp-runner";

async function ensureMcpServerAndGetTools(model: McpServer) {
    const svc = await McpRunner.getInstance().ensureService(model);
    if (!svc) {
        throw new Error("MCP Server " + model._id + " could not be started!");
    }
    const rawTools = (await svc.getTools())?.tools || [];
    return rawTools.map(x => ({
        mcpServerId: model._id!,
        name: x.name,
        description: x.description,
        parameters: x.inputSchema.properties ? Object.keys(x.inputSchema.properties).map(k => ({
            name: k,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            required: (x.inputSchema.required && (x.inputSchema.required as any).includes(k)) || false,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            type: (x.inputSchema.properties! as any)[k].type || "string",
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            description: (x.inputSchema.properties! as any)[k].description || undefined
        })) : undefined
    }));
}

export const toolsRoute: FastifyPluginAsync = (
    fastify: FastifyInstance
): Promise<void> => {
    fastify.get(
        "/api/tools",
        {
            schema: {
                description: "Get all available tools",
                operationId: "tools_get",
                summary: "Get all available tools"
            },
        },
        async (req, res) => {
            const allMcpServerEntities = await mcpServersCollection
                .find({
                    userEmail: req.user!.email,
                    isDeleted: false,
                })
                .toArray();
            const allMcpServers = allMcpServerEntities.map(
                (x) =>
                    ({
                        _id: x._id.toString(),
                        name: x.name,
                        type: x.type,
                        args: x.args,
                        command: x.command,
                        createdBy: x.createdBy,
                        createdDate: x.createdDate,
                        envVars: x.envVars,
                        sseApiHeaderAuth: x.sseApiHeaderAuth,
                        sseUrl: x.sseUrl,
                        updatedBy: x.updatedBy,
                        updatedDate: x.updatedDate,
                    } as McpServer)
            );

            const allTools = (await Promise.all(allMcpServers.map(s => ensureMcpServerAndGetTools(s)))).flat();
            res.send(allTools);
        }
    );

    return Promise.resolve();
};

export default toolsRoute;

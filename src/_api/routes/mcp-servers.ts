import mcpServerSchema from "@/shared-schemas/mcp-server";
import { FastifyInstance, FastifyPluginAsync } from "fastify";

export const mcpServersRoute: FastifyPluginAsync = (
  fastify: FastifyInstance
): Promise<void> => {

  fastify.post("/api/mcp-servers", {
    schema: {
        body: mcpServerSchema,
        response: {
            200: mcpServerSchema
        },
        description: "Register an MCP server",
        summary: "Register an MCP server",
        operationId: "mcpservers_create"
    }
  }, async (req) => {
    
    return { message: "Hello from 22222!!!" };
  });

  return Promise.resolve();
};

export default mcpServersRoute;

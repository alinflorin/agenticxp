import { FastifyInstance } from "fastify";
import helloRoute from "./routes/hello";

export default async function registerApiRoutes(
  fastify: FastifyInstance
): Promise<void> {
    await fastify.register(helloRoute);
}

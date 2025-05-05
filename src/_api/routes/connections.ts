import connectionValidator from "@/shared-validators/connection-validator";
import { FastifyInstance, FastifyPluginAsync } from "fastify";

export const connectionsRoute: FastifyPluginAsync = (
  fastify: FastifyInstance
): Promise<void> => {

  fastify.post("/api/connections", {
    schema: {
        body: connectionValidator
    }
  }, async () => {
    return { message: "Hello from 22222!!!" };
  });

  return Promise.resolve();
};

export default connectionsRoute;

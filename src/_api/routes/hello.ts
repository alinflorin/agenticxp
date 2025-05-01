import { FastifyInstance, FastifyPluginAsync } from "fastify";

export const helloRoute: FastifyPluginAsync = (
  fastify: FastifyInstance
): Promise<void> => {
  fastify.get("/api/hello", async () => {
    return { message: "Hello from 22222!!!" };
  });

  return Promise.resolve();
};

export default helloRoute;

import { FastifyInstance, FastifyPluginAsync } from "fastify";

export const helloRoute: FastifyPluginAsync = (
  fastify: FastifyInstance
): Promise<void> => {
  fastify.get("/api/hello", {preValidation: fastify.authenticate}, async () => {
    return { message: "Hello from Fastify!!!" };
  });

  return Promise.resolve();
};

export default helloRoute;

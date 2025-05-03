import { FastifyInstance, FastifyPluginAsync } from "fastify";

export const healthRoute: FastifyPluginAsync = (
    fastify: FastifyInstance
): Promise<void> => {
    fastify.get("/health", async (_, res) => {
        res.send({ healthy: true });
    });

    return Promise.resolve();
};

export default healthRoute;

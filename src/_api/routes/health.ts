import { version } from "@/version";
import { FastifyInstance, FastifyPluginAsync } from "fastify";

export const healthRoute: FastifyPluginAsync = (
    fastify: FastifyInstance
): Promise<void> => {
    fastify.get("/health", async (_, res) => {
        res.send({ healthy: true, version: version });
    });

    return Promise.resolve();
};

export default healthRoute;

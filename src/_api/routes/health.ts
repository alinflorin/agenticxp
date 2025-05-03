import { FastifyInstance, FastifyPluginAsync } from "fastify";
// import db from "../services/mongodb";

export const healthRoute: FastifyPluginAsync = (
    fastify: FastifyInstance
): Promise<void> => {
    fastify.get("/health", async (_, res) => {
        // await db.stats();
        res.send({ healthy: true });
    });

    return Promise.resolve();
};

export default healthRoute;

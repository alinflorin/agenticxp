import { HealthResponse } from "@/shared-models/health-response";
import { healthResponseSchema } from "@/shared-schemas/health-response";
import { version } from "@/version";
import { FastifyInstance, FastifyPluginAsync } from "fastify";

export const healthRoute: FastifyPluginAsync = (
    fastify: FastifyInstance
): Promise<void> => {
    fastify.get(
        "/health",
        {
            schema: {
                description: "Healthcheck",
                operationId: "healthcheck_get",
                summary: "Healthcheck",
                response: {
                    200: healthResponseSchema,
                },
            },
        },
        async (_, res) => {
            res.send({ healthy: true, version: version } as HealthResponse);
        }
    );

    return Promise.resolve();
};

export default healthRoute;

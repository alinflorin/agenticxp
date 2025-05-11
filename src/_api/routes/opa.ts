import userSchema, { User } from "@/shared-schemas/user";
import { FastifyError, FastifyInstance, FastifyPluginAsync } from "fastify";
import yup from "yup";
import { apiKeysCollection } from "../services/mongodb";

export const opaRoute: FastifyPluginAsync = (
    fastify: FastifyInstance
): Promise<void> => {
    fastify.get(
        "/api/opa/get-user-by-api-key",
        {
            schema: {
                description: "Get user by api key",
                operationId: "opa_getUserByApiKey",
                summary: "Get user by api key",
                querystring: yup
                    .object({
                        key: yup.string().required(),
                    })
                    .required(),
                response: {
                    200: userSchema,
                },
            },
        },
        async (req) => {
            const model = req.query as { key: string };

            const found = await apiKeysCollection.findOne({
                key: model.key,
                isDeleted: false,
            });
            if (!found) {
                const err: FastifyError = {
                    statusCode: 404,
                    message: "Not found",
                    code: "not_found",
                    name: "NotFound",
                };
                throw err;
            }

            return {
                email: found.userEmail,
                sub: model.key.split("-")[model.key.split("-").length - 1],
                email_verified: true,
            } as User;
        }
    );

    return Promise.resolve();
};

export default opaRoute;

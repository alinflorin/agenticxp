import { FastifyError, FastifyInstance, FastifyPluginAsync } from "fastify";
import { UserProfile } from "@/shared-schemas/user-profile";
import userProfileSchema from "@/shared-schemas/user-profile";
import yup from "yup";
import apiKeySchema, { ApiKey } from "@/shared-schemas/api-key";
import { apiKeysCollection } from "../services/mongodb";
import { v4 } from "uuid";
import { ApiKeyEntity } from "../models/entities/api-key-entity";
import { ObjectId } from "mongodb";

export const userProfileRoute: FastifyPluginAsync = (
    fastify: FastifyInstance
): Promise<void> => {
    fastify.get(
        "/api/user-profile",
        {
            schema: {
                description: "Get the profile of the user",
                operationId: "userprofile_get",
                summary: "Get the profile of the user",
                response: {
                    200: userProfileSchema,
                },
            },
        },
        async (req) => {
            return { is_admin: req.user?.is_admin || false } as UserProfile;
        }
    );

    fastify.get(
        "/api/user-profile/api-keys",
        {
            schema: {
                description: "Get the api keys of the user",
                operationId: "userprofile_getApiKeys",
                summary: "Get the api keys of the user",
                response: {
                    200: yup.array(apiKeySchema).required(),
                },
            },
        },
        async (req) => {
            const keyEntities = await apiKeysCollection
                .find({
                    userEmail: req.user!.email,
                    isDeleted: false,
                })
                .toArray();

            return keyEntities.map(
                (x) =>
                    ({
                        key: x.key,
                        _id: x._id!.toString(),
                        createdBy: x.createdBy,
                        createdDate: x.createdDate,
                        updatedBy: x.updatedBy,
                        updatedDate: x.updatedDate,
                        expirationTs: x.expirationTs
                    } as ApiKey)
            );
        }
    );

    fastify.post(
        "/api/user-profile/generate-api-key",
        {
            schema: {
                description: "Generate a new api key for the user",
                operationId: "userprofile_generateApiKey",
                summary: "Generate a new api key for the user",
                body: yup.object({
                    expirationTs: yup.number().optional()
                }).optional(),
                response: {
                    200: apiKeySchema,
                },
            },
        },
        async (req) => {
            const model = req.body as {expirationTs?: number};
            const newKey = "sk-" + v4().toString() + "-" + req.user!.sub;
            const entity: ApiKeyEntity = {
                createdBy: req.user!.email,
                createdDate: new Date().toISOString(),
                isDeleted: false,
                userEmail: req.user!.email,
                key: newKey,
                expirationTs: model.expirationTs
            };
            await apiKeysCollection.insertOne(entity);
            const x = entity;
            return {
                key: x.key,
                _id: x._id!.toString(),
                createdBy: x.createdBy,
                createdDate: x.createdDate,
                updatedBy: x.updatedBy,
                updatedDate: x.updatedDate,
                expirationTs: x.expirationTs
            } as ApiKey;
        }
    );

    fastify.delete(
        "/api/user-profile/revoke-api-key/:id",
        {
            schema: {
                description: "Revoke an api key for the user",
                operationId: "userprofile_generateApiKey",
                summary: "Revoke an api key for the user",
                params: yup.object({ id: yup.string().required() }).required(),
                response: {
                    200: apiKeySchema,
                },
            },
        },
        async (req) => {
            const { id } = req.params as { id: string };

            const found = await apiKeysCollection.findOne({
                userEmail: req.user!.email,
                isDeleted: false,
                _id: ObjectId.createFromHexString(id),
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
            await apiKeysCollection.updateOne(
                {
                    _id: ObjectId.createFromHexString(id),
                    userEmail: req.user!.email,
                    isDeleted: false,
                },
                {
                    $set: {
                        isDeleted: true,
                    },
                }
            );
            const x = found;
            return {
                key: x.key,
                _id: x._id!.toString(),
                createdBy: x.createdBy,
                createdDate: x.createdDate,
                updatedBy: x.updatedBy,
                updatedDate: x.updatedDate,
                expirationTs: x.expirationTs
            } as ApiKey;
        }
    );

    return Promise.resolve();
};

export default userProfileRoute;

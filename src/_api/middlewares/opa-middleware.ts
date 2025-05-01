import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import axios from "axios";
import { User } from "../models/user";

export interface OpaInput {
    input: {
        method: string;
        url: string;
        headers: Record<string, unknown>;
        body: unknown;
    };
}

export interface OpaAllowResponse {
    result: {
        allow: boolean;
        is_admin: boolean;
        user: User;
    }
}

export default function opaMiddleware(fastify: FastifyInstance) {
    fastify.addHook(
        "preHandler",
        async (request: FastifyRequest, reply: FastifyReply) => {
            if (!request.url.toLowerCase().startsWith("/api")) {
                return;
            }
            const opaInput: OpaInput = {
                input: {
                    method: request.method,
                    url: request.url,
                    headers: request.headers,
                    body: request.body,
                },
            };

            try {
                const response = await axios.post<OpaAllowResponse>(
                    "http://localhost:8181/v1/data/com/huna2/agenticxp/authz",
                    opaInput,
                    {
                        headers: { "Content-Type": "application/json" },
                        timeout: 5000, // 5 seconds timeout
                    }
                );

                if (!response.data?.result?.allow) {
                    reply.code(403).send({ message: "Forbidden by policy" });
                    return;
                }

                const user: User = {
                    email: response.data.result.user.email,
                    email_verified: response.data.result.user.email_verified,
                    name: response.data.result.user.name,
                    sub: response.data.result.user.sub,
                    is_admin: response.data.result.is_admin
                };

                request.user = user;
                

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (err: any) {
                fastify.log.error(`OPA check failed: ${err.message}`);
                reply.code(500).send({ message: "OPA check failed" });
            }
        }
    );
}

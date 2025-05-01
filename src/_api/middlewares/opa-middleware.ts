import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import axios from "axios";

export interface OpaInput {
    input: {
        method: string;
        url: string;
        headers: Record<string, unknown>;
        body: unknown;
    };
}

export interface OpaAllowResponse {
    result: boolean;
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

            console.log(opaInput);

            try {
                const response = await axios.post<OpaAllowResponse>(
                    "http://localhost:8181/v1/data/com/huna2/agenticxp/allow",
                    opaInput,
                    {
                        headers: { "Content-Type": "application/json" },
                        timeout: 5000, // 5 seconds timeout
                    }
                );

                if (!response.data?.result) {
                    reply.code(403).send({ message: "Forbidden by policy" });
                    return;
                }

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (err: any) {
                fastify.log.error(`OPA check failed: ${err.message}`);
                reply.code(500).send({ message: "OPA check failed" });
            }
        }
    );
}

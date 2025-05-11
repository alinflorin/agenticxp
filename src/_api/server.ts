import "./loadEnv";
import "../extendYup";
import Fastify from "fastify";
import helloRoute from "./routes/hello";
import opaMiddleware from "./middlewares/opa-middleware";
import userProfileRoute from "./routes/user-profile";
import spaRoute from "./routes/spa";
import healthRoute from "./routes/health";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { version } from "@/version";
import path from "path";
import connectionsRoute from "./routes/connections";
import {
    type YupTypeProvider,
    createJsonSchemaTransformer,
    createValidatorCompiler,
    defaultYupValidatorCompilerOptions,
    createSerializerCompiler,
} from "fastify-type-provider-yup";
import { ValidationError } from "yup";
import {
    extractErrorResponseFromError,
    extractErrorResponseFromValidationError,
} from "./helpers/errors-helper";
import mcpServersRoute from "./routes/mcp-servers";
import toolsRoute from "./routes/tools";
import agentsRoute from "./routes/agents";
import chatsRoute from "./routes/chats";
import opaRoute from "./routes/opa";
import openaiRoute from "./routes/openai";

const isDev = process.argv[process.argv.length - 1].endsWith(".ts");
console.log("Is Dev: ", isDev);

(async () => {
    try {
        const fastify = Fastify({
            logger: {
                level: "info",
            },
        }).withTypeProvider<YupTypeProvider>();

        fastify.setErrorHandler((error, _, reply) => {
            fastify.log.error(error);
            const statusCode = error.statusCode || 500;
            let response;

            // check if we have a validation error
            if (error.validationContext) {
                const validationError = (<unknown>error) as ValidationError;
                response =
                    extractErrorResponseFromValidationError(validationError);
            } else {
                response = extractErrorResponseFromError(error);
            }
            reply.status(statusCode).send(response);
        });

        fastify.setValidatorCompiler(
            createValidatorCompiler({
                ...defaultYupValidatorCompilerOptions,
                stripUnknown: false,
            })
        );
        fastify.setSerializerCompiler(
            createSerializerCompiler({
                ...defaultYupValidatorCompilerOptions,
                stripUnknown: false,
            })
        );

        await fastify.register(swagger, {
            openapi: {
                info: {
                    title: "AgenticXP API",
                    version: version,
                },
                components: {
                    securitySchemes: {
                        OpenID: {
                            type: "openIdConnect",
                            openIdConnectUrl:
                                process.env.OIDC_ISSUER +
                                "/.well-known/openid-configuration",
                        },
                        ApiKeyAuth: {
                            type: "apiKey",
                            name: "Authorization",
                            in: "header",
                        },
                    },
                },
                security: [{ OpenID: [] }, { ApiKeyAuth: [] }],
            },
            transform: createJsonSchemaTransformer({
                resolveOptions: {},
                skipList: [],
            }),
        });

        await fastify.register(swaggerUi, {
            routePrefix: "/swagger",
            baseDir: isDev ? undefined : path.resolve("./dist/server/swagger"),
            logo: {
                type: "image/png",
                content: Buffer.from(
                    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
                    "base64"
                ),
                href: "/swagger",
                target: "_self",
            },
            uiConfig: {
                persistAuthorization: true,
                deepLinking: false,
                docExpansion: "list",
                syntaxHighlight: {
                    activate: true,
                },
                tryItOutEnabled: true,
            },
            initOAuth: {
                appName: "agenticxp",
                clientId: "agenticxp",
                scopes: ["openid", "profile", "email", "offline_access"],
                scopeSeparator: " ",
            },
        });

        opaMiddleware(fastify);

        await fastify.register(healthRoute);
        await fastify.register(userProfileRoute);
        await fastify.register(helloRoute);
        await fastify.register(connectionsRoute);
        await fastify.register(mcpServersRoute);
        await fastify.register(toolsRoute);
        await fastify.register(agentsRoute);
        await fastify.register(chatsRoute);
        await fastify.register(openaiRoute);
        await fastify.register(opaRoute);
        await fastify.register(spaRoute);

        const start = async () => {
            try {
                await fastify.listen({ port: 3000, host: "0.0.0.0" });
                console.log(`Server listening on port 3000`);
            } catch (err) {
                fastify.log.error(err);
                process.exit(1);
            }
        };

        process.on("SIGTERM", async () => {
            try {
                await fastify.close();
            } catch (err: unknown) {
                console.error(err);
            }
            process.exit(0);
        });

        await start();
    } catch (err: unknown) {
        console.error(err);
        process.exit(1);
    }
})();

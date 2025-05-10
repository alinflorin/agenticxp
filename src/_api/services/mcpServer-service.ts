import { McpServer } from "@/shared-schemas/mcp-server";
import { version } from "@/version";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { Transport } from "@modelcontextprotocol/sdk/shared/transport.js";
import { EventSource } from "eventsource";

// define EventSource globally
globalThis.EventSource = EventSource;

export default class McpServerService {
    private _client: Client;
    private _transport: Transport;

    constructor(private _model: McpServer) {
        this._client = new Client({
            name: "agenticxp-" + process.env.ENV + "-" + process.env.HOSTNAME,
            version: version,
        });
        if (this._model.type === "sse") {
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            const _this = this;
            this._transport = new SSEClientTransport(
                new URL(this._model.sseUrl!),
                {
                    requestInit: {
                        headers: {
                            authorization: this._model.sseApiHeaderAuth || "",
                        },
                    },
                    eventSourceInit: {
                        async fetch(
                            input: Request | URL | string,
                            init?: RequestInit
                        ) {
                            const headers = new Headers(init?.headers || {});
                            if (_this._model.sseApiHeaderAuth) {
                                headers.set(
                                    "Authorization",
                                    `${_this._model.sseApiHeaderAuth}`
                                );
                            }
                            const reply = await fetch(input, {
                                ...init,
                                headers,
                            });
                            return reply;
                        },
                        // We have to cast to "any" to use it, since it's non-standard
                    } as any, // eslint-disable-line @typescript-eslint/no-explicit-any
                }
            );
        } else {
            this._transport = new StdioClientTransport({
                command: this._model.command!,
                args: this._model.args,
                env: this._model.envVars,
            });
        }
    }

    async connect() {
        await this._client.connect(this._transport);
    }

    async getTools() {
        return this._client.listTools();
    }

    async validate() {
        try {
            await this.getTools();
            return true;
        } catch {
            return false;
        }
    }

    async disconnect() {
        await this._client.close();
    }
    
    get id() {
        return this._model._id;
    }
}

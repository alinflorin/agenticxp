import { McpServer } from "@/shared-schemas/mcp-server";
import { version } from "@/version";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { Transport } from "@modelcontextprotocol/sdk/shared/transport.js";

export class McpServerService {
    private _client: Client;
    private _transport: Transport;

    constructor(private _model: McpServer) {
        this._client = new Client({
            name: "agenticxp-" + process.env.ENV,
            version: version,
        });
        if (this._model.type === "sse") {
            this._transport = new SSEClientTransport(
                new URL(this._model.sseUrl!),
                {
                    requestInit: {
                        headers: [
                            [
                                "Authorization",
                                this._model.sseApiHeaderAuth
                                    ? this._model.sseApiHeaderAuth
                                    : "",
                            ],
                        ],
                    },
                }
            );
        } else {
            this._transport = new StdioClientTransport({
                command: this._model.command!,
                env: this._model.envVars,
            });
        }
    }

    async connect() {
        await this._client.connect({});
    }

    async getTools() {}

    async validate() {
        try {
            await this.getTools();
            return true;
        } catch {
            return false;
        }
    }
}

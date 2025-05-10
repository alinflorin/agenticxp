import { McpServer } from "@/shared-schemas/mcp-server";
import McpServerService from "./mcpServer-service";

export class McpRunner {
    private static instance: McpRunner | undefined;
    private _mcpServicesMap = new Map<string, McpServerService>();

    static getInstance() {
        if (!this.instance) {
            this.instance = new McpRunner();
        }
        return this.instance;
    }

    async ensureService(model: McpServer) {
        if (!model._id) {
            throw new Error("Cannot instantiate MCP Server without ID");
        }
        if (this._mcpServicesMap.has(model._id!)) {
            return this._mcpServicesMap.get(model._id!);
        }
        const svc = new McpServerService(model);
        await svc.connect();
        return svc;
    }

    async deregister(model: McpServer) {
        if (!model._id) {
            throw new Error("Cannot deregister MCP Server without ID");
        }
        if (!this._mcpServicesMap.has(model._id!)) {
            return;
        }
        await this._mcpServicesMap.get(model._id!)?.disconnect();
        this._mcpServicesMap.delete(model._id!);
    }
}

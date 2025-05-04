import { ToolParameter } from "./tool-parameter";

export interface Tool {
    mcpServerId: string;
    name: string;
    description?: string;
    parameters?: ToolParameter[];
}
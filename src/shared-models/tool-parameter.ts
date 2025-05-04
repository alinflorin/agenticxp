export interface ToolParameter {
    name: string;
    type: string;
    description?: string;
    required: boolean;
    defaultValue?: unknown;
}
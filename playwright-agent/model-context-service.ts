import type { Page } from "playwright";

export class ModelContextService {
  public async executeWebMcpTool<T>(
    page: Page,
    toolName: string,
    args: unknown,
  ): Promise<T> {
    return await page.evaluate(
      async ({ toolName, args }) => {
        const modelContext =
          (document as any).modelContext ?? (navigator as any).modelContext;
        if (!modelContext) {
          throw new Error("Model Context API is not available");
        }

        const tools = await modelContext.getTools();

        const tool = tools.find((tool: any) => tool.name === toolName);

        if (!tool) {
          throw new Error(`Tool not found: ${toolName}`);
        }

        const result = await modelContext.executeTool(
          tool,
          JSON.stringify(args),
        );

        if (
          result &&
          typeof result === "object" &&
          "structuredContent" in result
        ) {
          return result.structuredContent;
        }

        const textContent = result?.content?.find(
          (item: any) => typeof item?.text === "string",
        )?.text;
        if (textContent) {
          try {
            return JSON.parse(textContent);
          } catch {
            return result;
          }
        }

        return result;
      },
      { toolName, args },
    );
  }
}

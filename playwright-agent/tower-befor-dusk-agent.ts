import {
  FunctionCallingConfigMode,
  type Content,
  type Tool,
} from "@google/genai";
import type { Page } from "playwright";
import { GenaiService } from "./genai-service.js";
import { ModelContextService } from "./model-context-service.js";
import { towerBeforeDuskTools } from "./model.js";

const MAX_TOOL_ROUNDS = 5;
const PLANNING_TOOL_NAMES = ["checkPlan", "submitPlan"];

export class TowerBeroDuskAgent {
  private readonly genaiService: GenaiService;
  private readonly modelContextService: ModelContextService;

  constructor(
    genaiService = new GenaiService(),
    modelContextService = new ModelContextService(),
  ) {
    this.genaiService = genaiService;
    this.modelContextService = modelContextService;
  }

  public async play(page: Page): Promise<void> {
    this.genaiService.clearHistory();

    const gameState = await this.modelContextService.executeWebMcpTool(
      page,
      "getGameState",
      {},
    );
    
    const planningTools = this.getTools(PLANNING_TOOL_NAMES);

    let contents: Content[] = [
      {
        role: "user",
        parts: [
          {
            text:
              "Play Tower Before Dusk autonomously. Call exactly one tool at a time. " +
              "Inspect the game and call checkPlan before submitPlan. If a plan is invalid, " +
              "correct it and call checkPlan again while checksRemaining is greater than zero. " +
              "When no checks remain, submit your best corrected plan. " +
              "Do not stop at a text answer.\n\n" +
              `Current game state:\n${JSON.stringify(gameState)}`,
          },
        ],
      },
    ];

    for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {

      console.log(`Starting round: ${round}`);

      const response = await this.genaiService.generateContentAsync({
        contents,
        config: {
          tools: planningTools,
          toolConfig: {
            functionCallingConfig: {
              mode: FunctionCallingConfigMode.ANY,
              allowedFunctionNames: PLANNING_TOOL_NAMES,
            },
          },
        },
      });

      console.log(`RESPONSE: ${response}`);

      const functionCalls = response.functionCalls ?? [];
      const [functionCall] = functionCalls;
      const toolName = functionCall?.name;
      if (functionCalls.length !== 1 || !toolName) {
        throw new Error(
          `Expected one planning tool call, received ${functionCalls.length}`,
        );
      }

      if (!PLANNING_TOOL_NAMES.includes(toolName)) {
        throw new Error(`Unexpected planning tool: ${toolName}`);
      }

      const result = await this.modelContextService.executeWebMcpTool(
        page,
        toolName,
        functionCall.args ?? {},
      );

      if (toolName === "submitPlan") {
        return;
      }

      contents = [
        {
          role: "user",
          parts: [
            {
              functionResponse: {
                id: functionCall.id,
                name: toolName,
                response: { output: result ?? null },
              },
            },
          ],
        },
      ];
    }

    throw new Error(
      `Agent did not submit a plan within ${MAX_TOOL_ROUNDS} tool rounds`,
    );
  }

  private getTools(allowedNames: string[]): Tool[] {
    const allowedNameSet = new Set(allowedNames);
    const functionDeclarations = towerBeforeDuskTools.flatMap(
      tool =>
        tool.functionDeclarations?.filter(declaration =>
          declaration.name ? allowedNameSet.has(declaration.name) : false,
        ) ?? [],
    );

    return [{ functionDeclarations }];
  }
}

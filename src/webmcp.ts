import type { GameState } from "./models/game-state";

export type GameAction =
  | "MOVE_UP"
  | "MOVE_DOWN"
  | "MOVE_LEFT"
  | "MOVE_RIGHT";

export type GamePlan = {
  actions: GameAction[];
  summary?: string;
};

type WebMcpContext = {
  registerTool(tool: object, options: { signal: AbortSignal }): void;
};

type AiPlanHandler = (plan: GamePlan) => void | Promise<void>;

declare global {
  interface Document {
    modelContext?: WebMcpContext;
  }

  interface Navigator {
    modelContext?: WebMcpContext;
  }
}

const registeredTools: Record<"getGameState" | "submitPlan", AbortController | null> = {
  getGameState: null,
  submitPlan: null,
};

let aiPlanHandler: AiPlanHandler | null = null;

export function setAiPlanHandler(handler: AiPlanHandler | null): void {
  aiPlanHandler = handler;
}

export function registerGameTools(getGameState: () => GameState): void {
  const modelContext = document.modelContext || navigator.modelContext;
  if (!modelContext || registeredTools.getGameState || registeredTools.submitPlan) {
    return;
  }

  registeredTools.getGameState = new AbortController();
  registeredTools.submitPlan = new AbortController();

  modelContext.registerTool(createGetGameStateTool(getGameState), {
    signal: registeredTools.getGameState.signal,
  });
  modelContext.registerTool(createSubmitPlanTool(), {
    signal: registeredTools.submitPlan.signal,
  });
}

export function unregisterGameTools(): void {
  registeredTools.getGameState?.abort();
  registeredTools.submitPlan?.abort();
  registeredTools.getGameState = null;
  registeredTools.submitPlan = null;
}

function createGetGameStateTool(getGameState: () => GameState): object {
  return {
    name: "getGameState",
    description:
      "Get the current Tower Before Dusk game state. Use this state to prepare one complete one-shot plan before calling submitPlan.",
    outputSchema: {
      type: "object",
      properties: {
        objective: { type: "string" },
        legend: { type: "object", additionalProperties: { type: "string" } },
        rules: { type: "object", additionalProperties: { type: "string" } },
        actions: {
          type: "array",
          items: { type: "string" },
        },
        remainingMoves: { type: "number" },
        wood: { type: "number" },
        visibleMap: {
          type: "array",
          items: { type: "string" },
        },
      },
      required: [
        "objective",
        "legend",
        "rules",
        "actions",
        "remainingMoves",
        "wood",
        "visibleMap",
      ],
    },
    execute: async () => getGameState(),
    annotations: {
      readOnlyHint: true,
      untrustedContentHint: true,
    },
  };
}

function createSubmitPlanTool(): object {
  return {
    name: "submitPlan",
    description:
      "Submit a complete one-shot action plan for the game UI to validate and replay with delay.",
    inputSchema: {
      type: "object",
      properties: {
        actions: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "MOVE_UP",
              "MOVE_DOWN",
              "MOVE_LEFT",
              "MOVE_RIGHT",
            ],
          },
        },
        summary: { type: "string" },
      },
      required: ["actions"],
      additionalProperties: false,
    },
    outputSchema: {
      type: "string",
      description: "Short confirmation that the plan was received.",
    },
    execute: async (plan: GamePlan) => {
      if (aiPlanHandler) {
        void aiPlanHandler(plan);
      }
      return "Plan received.";
    },
    annotations: {
      readOnlyHint: false,
      untrustedContentHint: true,
    },
  };
}

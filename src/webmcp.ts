import type { GameState } from "./models/game-state";
import type { GamePlan, PlanCheckResult } from "./models/ai-plan";

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

const registeredTools: Record<"getGameState" | "checkPlan" | "submitPlan", AbortController | null> = {
  getGameState: null,
  checkPlan: null,
  submitPlan: null,
};

let aiPlanHandler: AiPlanHandler | null = null;

export function setAiPlanHandler(handler: AiPlanHandler | null): void {
  aiPlanHandler = handler;
}

export function registerGameTools(
  getGameState: () => GameState,
  checkPlan: (plan: GamePlan) => PlanCheckResult,
): void {
  const modelContext = document.modelContext || navigator.modelContext;
  if (
    !modelContext ||
    registeredTools.getGameState ||
    registeredTools.checkPlan ||
    registeredTools.submitPlan
  ) {
    return;
  }

  registeredTools.getGameState = new AbortController();
  registeredTools.checkPlan = new AbortController();
  registeredTools.submitPlan = new AbortController();

  modelContext.registerTool(createGetGameStateTool(getGameState), {
    signal: registeredTools.getGameState.signal,
  });
  modelContext.registerTool(createCheckPlanTool(checkPlan), {
    signal: registeredTools.checkPlan.signal,
  });
  modelContext.registerTool(createSubmitPlanTool(), {
    signal: registeredTools.submitPlan.signal,
  });
}

export function unregisterGameTools(): void {
  registeredTools.getGameState?.abort();
  registeredTools.checkPlan?.abort();
  registeredTools.submitPlan?.abort();
  registeredTools.getGameState = null;
  registeredTools.checkPlan = null;
  registeredTools.submitPlan = null;
}

function createGetGameStateTool(getGameState: () => GameState): object {
  return {
    name: "getGameState",
    description:
      "Get the current board. visibleMap rows run top-to-bottom; each character is x=0 onward. P=player, .=land, W=tree (enter: 2 moves, +1 wood), ~=water (requires 2 wood; entering unbridged water: 2 moves, -2 wood), B=walkable bridge, R=blocked rock, G=goal. Move U/D/L/R costs 1. Reach G before remainingMoves reaches 0. Use checkPlan before submitPlan if available.",
    outputSchema: {
      type: "object",
      properties: {
        remainingMoves: { type: "number" },
        wood: { type: "number" },
        visibleMap: {
          type: "array",
          items: { type: "string" },
        },
      },
      required: [
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

function createCheckPlanTool(
  checkPlan: (plan: GamePlan) => PlanCheckResult,
): object {
  return {
    name: "checkPlan",
    description:
      "Validate a complete proposed plan without changing the game. If valid is true, submit that plan. If valid is false, use reason, finalPosition, and remainingMoves to correct it. checksRemaining is the number of evaluations left. If checksRemaining is 0, submit the corrected plan without calling checkPlan again.",
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
      },
      required: ["actions"],
      additionalProperties: false,
    },
    outputSchema: {
      type: "object",
      properties: {
        valid: { type: "boolean" },
        reachedGoal: { type: "boolean" },
        limitReached: { type: "boolean" },
        checksRemaining: { type: "number" },
        finalPosition: {
          type: "object",
          properties: {
            x: { type: "number" },
            y: { type: "number" },
          },
          required: ["x", "y"],
          additionalProperties: false,
        },
        remainingMoves: { type: "number" },
        reason: { type: "string" },
      },
      required: [
        "valid",
        "reachedGoal",
        "limitReached",
        "checksRemaining",
        "finalPosition",
        "remainingMoves",
        "reason",
      ],
      additionalProperties: false,
    },
    execute: async (plan: GamePlan) => {
      return checkPlan(plan);
    },
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
      },
      required: ["actions"],
      additionalProperties: false,
    },
    execute: async (plan: GamePlan) => {
      if (aiPlanHandler) {
        void aiPlanHandler(plan);
      }
    },
    annotations: {
      readOnlyHint: false,
      untrustedContentHint: true,
    },
  };
}

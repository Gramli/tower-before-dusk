import type { Tool } from "@google/genai";

const planParametersJsonSchema = {
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
};

export const towerBeforeDuskTools: Tool[] = [
  {
    functionDeclarations: [
      {
        name: "getGameState",
        description:
          "Get the current board. visibleMap rows run top-to-bottom; each character is x=0 onward. P=player, .=land, W=tree (enter: 2 moves, +1 wood), ~=water (requires 2 wood; entering unbridged water: 2 moves, -2 wood), B=walkable bridge, R=blocked rock, G=goal. Move U/D/L/R costs 1. Reach G before remainingMoves reaches 0. Use checkPlan before submitPlan if available.",
        responseJsonSchema: {
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
      },
      {
        name: "checkPlan",
        description:
          "Validate a complete proposed plan without changing the game. If valid is true, submit that plan. If valid is false, use reason, finalPosition, and remainingMoves to correct it. checksRemaining is the number of evaluations left. If checksRemaining is 0, submit the corrected plan without calling checkPlan again.",
        parametersJsonSchema: planParametersJsonSchema,
        responseJsonSchema: {
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
      },
      {
        name: "submitPlan",
        description:
          "Submit a complete one-shot action plan for the game UI to validate and replay with delay.",
        parametersJsonSchema: planParametersJsonSchema,
      },
    ],
  },
];

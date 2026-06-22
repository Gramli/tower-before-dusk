# Tower Before Dusk

[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Canvas](https://img.shields.io/badge/HTML%20Canvas-game-2E7D32)](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)

Tower Before Dusk is a tile-based puzzle game about reaching the tower before
sunset. Plan each route carefully: every move spends daylight, trees provide
wood, and water can only be crossed by building bridges.

The game is built as a modern browser app with TypeScript, HTML canvas, and
Vite. It also exposes a small model-context interface so an assistant can read
the current map, validate a route, and submit a complete action plan for replay
in the UI.

## Features

- Eight handcrafted puzzle levels with different tower layouts and move limits
- Daylight system that tracks the move budget from morning through sunset
- Trees that are collected automatically for wood when entered
- Bridge building over water, consuming two wood per water tile
- Rocks, water, bridges, towers, and sprite-based terrain rendering
- Responsive canvas scaling for different browser sizes
- Keyboard-driven play with restart and help shortcuts
- HUD for level name, wood count, moves used, daylight phase, and moves left
- Optional Web MCP-style tools for reading state, checking plans, and replaying
  AI plans

## How to Play

Reach a tower before the move budget runs out. You start each level in the upper
left corner and must navigate around rocks and water. Trees are walkable and are
collected for wood as soon as you enter them. Collecting a tree costs one extra
move. Entering a water tile requires at least two wood, then builds a single
bridge on that tile and consumes the wood.

Each move costs one move. Building a bridge also costs one extra move.

### Keyboard Controls

| Key | Action |
| --- | --- |
| Arrow keys | Move one tile |
| `Enter` | Start the game or continue to the next level after winning |
| `Space` | Start the game from the menu |
| `R` | Restart the current level |
| `H` | Show the help dialog |
| Any key or click | Close the help dialog |

## Getting Started

Requirements:

- [Node.js](https://nodejs.org/)
- npm

Install dependencies and start the development server:

```bash
npm ci
npm run dev
```

Open the URL printed by Vite, usually `http://localhost:5173`.

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Project Structure

```text
.
|-- public/          # Static browser assets such as the favicon
|-- src/
|   |-- assets/      # Game sprites
|   |-- game-controls/
|   |   |-- input.ts           # Keyboard and pointer input
|   |   `-- ai-plan-replayer.ts # Replays submitted AI action plans
|   |-- game-logic/  # Daylight and move-budget helpers
|   |-- game-objects/ # Player, trees, bridges, terrain objects
|   |-- levels/      # Level definitions and map setup helpers
|   |-- models/      # Game state, AI plan, and shared model types
|   |-- rendering/   # Canvas, HUD, overlay, and object renderers
|   |-- ai-game.ts   # AI-only game-state projection and plan simulation
|   |-- game.ts      # Core gameplay rules
|   |-- main.ts      # Browser entry point
|   `-- webmcp.ts    # Model-context tool registration
|-- index.html
|-- package.json
`-- tsconfig.json
```

## AI Plan Tools

When a compatible model-context runtime is available on `document.modelContext`
or `navigator.modelContext`, the game registers three tools:

- `getGameState` returns the dynamic state: remaining moves, wood, and a compact
  visible map.
- `checkPlan` simulates a proposed action list without changing the game. Its
  result includes whether the goal is reached, final position, remaining moves,
  a reason, and the number of checks still available.
- `submitPlan` accepts a full one-shot action list and replays it in the game
  board with a short delay between moves.

Supported plan actions are `MOVE_UP`, `MOVE_DOWN`, `MOVE_LEFT`, and
`MOVE_RIGHT`.

`visibleMap` is an array of rows from top to bottom. Each row is a compact
string: its first character is `x=0`. `P` is the player, `.` land, `W` a tree,
`~` water, `B` a bridge, `R` rock, and `G` a goal.

Use the tools in this order:

1. Call `getGameState` and prepare a complete route.
2. Call `checkPlan` to validate it. If the plan is invalid and checks remain,
   revise it and check again.
3. When the plan is valid—or no checks remain after revising it—call
   `submitPlan`.

The number of validations available for each level is configured in `main.ts`:

```ts
new AIGame(game, { maxPlanChecksPerLevel: 2 });
```

## License

No license file is currently included in this repository.

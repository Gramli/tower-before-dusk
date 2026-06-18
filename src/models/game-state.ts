export interface GameState {
  objective: string;
  legend: IGameLegend;
  rules: IGameRules;
  remainingMoves: number;
  wood: number;
  visibleMap: string[];
  actions: string[];
}

export interface IGameLegend {
  ".": string;
  P: string;
  W: string;
  "~": string;
  R: string;
  B: string;
  G: string;
  [symbol: string]: string;
}

export interface IGameRules {
  map: string;
  movement: string;
  rock: string;
  wood: string;
  water: string;
  bridge: string;
  bridgeLimit: string;
  strategy: string;
  goal: string;
  lose: string;
}

export const gameState: GameState = {
  objective:  "Reach G before sunset using as few moves as possible. Do not collect unnecessary wood.",

  legend: {
    P: "player start position",
    ".": "land / walkable tile",
    W: "wood / walkable tile, can be collected",
    "~": "water / blocked unless player has enough wood",
    R: "rock / blocked tile",
    B: "bridge / walkable tile created after entering water",
    G: "goal / walkable tile",
  },

  rules: {
    map:
      "visibleMap is an array of map rows from top to bottom. The first symbol in each row is x=0, and rows start at y=0. Symbols are separated by spaces for readability.",

    movement:
      "The player can move one tile up, down, left, or right. Each movement costs 1 move.",

    rock:
      "Rock tiles marked R are blocked and cannot be entered.",

    wood:
      "Tree tiles marked W are walkable, but entering W automatically collects the tree. This costs 1 extra move, adds 1 wood, and removes W from the map. Because collecting wood costs an extra move, avoid W unless the wood is needed to cross water.",

    water:
      "Water cannot be entered unless the player has at least 2 wood.",

    bridge:
      "When the player moves into a water tile with at least 2 wood, a bridge is built automatically on that single water tile. This costs 1 extra move, consumes 2 wood, and changes only that one water tile to B. Other connected water tiles remain water.",

    bridgeLimit:
      "Each bridge covers only one water tile. If there are multiple water tiles in a row, the player needs enough wood to build one bridge per water tile.",

    strategy:
      "Use the minimum number of actions needed to reach G. Do not collect wood unless it is required to build enough bridges. Avoid stepping on W unless that wood is necessary. Extra wood has no value at the end.",

    goal:
      "The player wins immediately when reaching G using no more than the maximum allowed moves.",

    lose:
      "The player loses if the move budget is exhausted before reaching G, or if no valid action can reach G.",
  },

  actions: [
    "MOVE_UP",
    "MOVE_DOWN",
    "MOVE_LEFT",
    "MOVE_RIGHT",
  ],

  remainingMoves: 30,
  wood: 0,

  visibleMap: [
    "P . W W W W ~ ~ G",
  ],
};

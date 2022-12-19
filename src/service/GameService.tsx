import React, { createContext, useContext, useCallback, useReducer, useMemo } from "react";
import {IContextProps,SourceCellModel,TileCellModel} from "../model"

const GameContext = createContext<IContextProps>({
  target:[0,0,0],
  maxMoves:0,
  boardWidth: 0,
  boardHeight: 0,
  sources: [],
  tiles: [],
  checkedSources: [],
  clickCount: 0,
  closestTile:{x:0,y:0,r:0,g:0,b:0,diff:0},
  initGame:()=>null,
  exitGame:()=>null,
  dropSource:()=>null,
  clickSource:()=>null,
})
const actions = {
  INIT_GAME: "INIT_GAME",
  EXIT_GAME: "EXIT_GAME",
  UPDATE_GAME: "UPDATE_GAME",
};

const reducer = (state:any, action:{type:string;data:any}) => {
  switch (action.type) {
    case actions.INIT_GAME:
      return action.data;
    case actions.EXIT_GAME:
      return {
        boardWidth: 0,
        boardHeight: 0,
        sources: [],
        tiles: [],
        checkedSources: [],
        clickCount: 0,
      };
    case actions.UPDATE_GAME:
      return Object.assign({}, state, action.data);
    default:
      return state;
  }
};
export const GameProvider = ({ children }:{children:React.ReactNode}) => {
  const [state, dispatch] = useReducer(reducer, {
    boardWidth: 0,
    boardHeight: 0,
    sources: [],
    tiles: [],
    checkedSources: [],
    clickCount: 0,
  });
  const getRGB = (source:SourceCellModel, tile:TileCellModel) => {
    const rgb:{r:number;g:number,b:number} = {r:0,g:0,b:0};
    let ratio = 1;
    let w = state.boardWidth;
    let h = state.boardHeight;
    switch (source["direction"]) {
      case 0:
        ratio = (h - tile["y"]) / (h + 1);
        break;
      case 1:
        ratio = (tile["x"] + 1) / (w + 1);
        break;
      case 2:
        ratio = (tile["y"] + 1) / (h + 1);
        break;
      case 3:
        ratio = (w - tile["x"]) / (w + 1);
        break;
      default:
        break;
    }
    rgb["r"] = Math.floor(ratio * source["r"]);
    rgb["g"] = Math.floor(ratio * source["g"]);
    rgb["b"] = Math.floor(ratio * source["b"]);
    return rgb;
  };

  const updateTiles = (source:SourceCellModel, checkedSources:SourceCellModel[]) => {
    let tiles:TileCellModel[];
    source["direction"] === 1 || source["direction"] === 3
      ? (tiles = state.tiles[source["index"]])
      : (tiles = state.tiles.map((tr:TileCellModel[]) => tr[source["index"]]));
    tiles.forEach((t) => {
      const shineSources = checkedSources.filter(
        (c) =>
          ((c["direction"] === 0 || c["direction"] === 2) && c["index"] === t["x"]) ||
          ((c["direction"] === 1 || c["direction"] === 3) && c["index"] === t["y"])
      );

      if (shineSources.length > 1) {
        const rgbs = [...shineSources, source].map((s) => getRGB(s, t));
        const r = rgbs.map((s) => s["r"]).reduce((prev, current) => prev + current, 0);
        const g = rgbs.map((s) => s["g"]).reduce((prev, current) => prev + current, 0);
        const b = rgbs.map((s) => s["b"]).reduce((prev, current) => prev + current, 0);
        const f = 255 / Math.max(r, g, b, 255);
        t["r"] = Math.floor(r * f);
        t["g"] = Math.floor(g * f);
        t["b"] = Math.floor(b * f);
      } else Object.assign(t, getRGB(source, t));

      const tg = state.target;
      const diff =
        (1 / 255) *
        (1 / Math.sqrt(3)) *
        Math.sqrt(
          (t["r"] - tg[0]) * (t["r"] - tg[0]) +
            (t["g"] - tg[1]) * (t["g"] - tg[1]) +
            (t["b"] - tg[2]) * (t["b"] - tg[2])
        );
      t["diff"] = diff;
    });
  };

  const initialState = useCallback((w:number, h:number, tg:number[]) => {
    const tiles:TileCellModel[][] = [];
    const diff = (1 / 255) * (1 / Math.sqrt(3)) * Math.sqrt(tg[0] * tg[0] + tg[1] * tg[1] + tg[2] * tg[2]);
    for (let i = 0; i < h; i++) {
      tiles[i] = [];
      for (let j = 0; j < w; j++) {
        tiles[i][j] = { x: j, y: i, r: 0, g: 0, b: 0, diff: diff };
      }
    }

    const sources = [];
    const topSources = [];
    for (let i = 0; i < w; i++) topSources[i] = { index: i, direction: 0, r: 0, g: 0, b: 0 };
    sources[0] = topSources;
    const rightSources = [];
    for (let i = 0; i < h; i++) rightSources[i] = { index: i, direction: 1, r: 0, g: 0, b: 0 };
    sources[1] = rightSources;
    const bottomSources = [];
    for (let i = 0; i < w; i++) bottomSources[i] = { index: i, direction: 2, r: 0, g: 0, b: 0 };
    sources[2] = bottomSources;
    const leftSources = [];
    for (let i = 0; i < h; i++) leftSources[i] = { index: i, direction: 3, r: 0, g: 0, b: 0 };
    sources[3] = leftSources;
    return {
      boardWidth: w,
      boardHeight: h,
      sources: sources,
      tiles: tiles,
      checkedSources: [],
      clickCount: 0,
      closestTile: { x: 0, y: 0, r: 0, g: 0, b: 0 },
    };
  }, []);

  const value = {
    target: state.target,
    maxMoves: state.maxMoves,
    sources: state.sources,
    tiles: state.tiles,
    checkedSources: state.checkedSources,
    boardWidth: state.boardWidth,
    boardHeight: state.boardHeight,
    clickCount: state.clickCount,
    closestTile: useMemo(() => {
      const tiles:TileCellModel[] = state.tiles.flat();
      const ts = tiles.filter((t) => t.diff > 0).sort((a, b) => a.diff - b.diff);
      return ts[0];
    }, [state.tiles]),

    initGame: (data:any) => {
      const game:any = initialState(data["width"], data["height"], data["target"]);
      game["maxMoves"] = data["maxMoves"];
      game["target"] = data["target"];
      dispatch({ type: actions.INIT_GAME, data: game });
    },

    exitGame: () => {
      dispatch({ type: actions.EXIT_GAME,data:null});
    },

    clickSource: (source:SourceCellModel) => {
      if (state.clickCount === 0) {
        source["r"] = 255;
        source["g"] = 0;
        source["b"] = 0;
      } else if (state.clickCount === 1) {
        source["r"] = 0;
        source["g"] = 255;
        source["b"] = 0;
      } else if (state.clickCount === 2) {
        source["r"] = 0;
        source["g"] = 0;
        source["b"] = 255;
      } else return;
      const clickedSource = state.sources[source["direction"]][source["index"]];
      Object.assign(clickedSource, source);
      const checkedSources = [...state.checkedSources, source];
      updateTiles(source, checkedSources);

      const closests:TileCellModel[] = state.tiles
        .flat()
        .filter((t:TileCellModel) => t.diff > 0)
        .sort((a:TileCellModel, b:TileCellModel) => a.diff - b.diff);
      const data = {
        checkedSources: checkedSources,
        sources: [...state.sources],
        tiles: [...state.tiles],
        clickCount: state.clickCount + 1,
        maxMoves: state.maxMoves - 1,
        closestTile: closests[0],
      };
      dispatch({ type: actions.UPDATE_GAME, data: data });
    },

    dropSource: (tile:{x:number;y:number;r:number;g:number;b:number}, source:SourceCellModel) => {
      if (state.maxMoves == 0) return;
      const droppedSource = state.sources[source["direction"]][source["index"]];
      Object.assign(droppedSource, { r: tile["r"], g: tile["g"], b: tile["b"] });
      const checkedSource:SourceCellModel = state.checkedSources.find(
        (s:SourceCellModel) => s["index"] === source["index"] && s["direction"] === source["direction"]
      );
      const checkedSources = checkedSource ? state.checkedSources : [...state.checkedSources, droppedSource];
      updateTiles(droppedSource, checkedSources);

      const closests = state.tiles
        .flat()
        .filter((t:TileCellModel) => t.diff > 0)
        .sort((a:TileCellModel, b:TileCellModel) => a.diff - b.diff);
      const data = {
        checkedSources: checkedSources,
        sources: [...state.sources],
        tiles: [...state.tiles],
        maxMoves: state.maxMoves - 1,
        closestTile: closests[0],
      };
      dispatch({ type: actions.UPDATE_GAME, data: data });
    },
  };
  return (<GameContext.Provider value={value}>{children}</GameContext.Provider>);
};
const useGameService = () => {
  return useContext(GameContext);
};
export default useGameService;

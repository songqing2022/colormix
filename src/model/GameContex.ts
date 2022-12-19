import { SourceCellModel } from "./Source";
import { TileCellModel } from "./Tile";
export interface IContextProps {
    target: number[];
    maxMoves: number;
    sources: SourceCellModel[][];
    tiles: TileCellModel[][];
    checkedSources: SourceCellModel[];
    boardWidth: number;
    boardHeight: number;
    clickCount: number;
    closestTile:TileCellModel;
    initGame:(data:any)=>void;
    clickSource:(source:SourceCellModel)=>void;
    exitGame:()=>void;
    dropSource:(tile:{x:number;y:number;r:number;g:number;b:number},source:SourceCellModel)=>void;
  }
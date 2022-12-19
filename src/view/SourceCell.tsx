import React from "react";
import Tooltip from "@mui/material/Tooltip";
import { useDrop } from "react-dnd";
import "../App.css";
import useGameService from "../service/GameService";
const SourceCell = React.memo(function SourceCell({ index, direction, width, r, g, b }:{index:number;direction:number;width:number;r:number;g:number;b:number}) {
  const { clickCount, clickSource, dropSource } = useGameService();
  const [{ isOver}, drop] = useDrop({
    accept: "draggable",
    drop: (item:{x:number;y:number;r:number;g:number;b:number}) => dropSource(item, { index, direction, r, g, b }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <Tooltip title={r + "," + g + "," + b} placement="bottom-end">
      <div
        ref={drop}
        className="source"
        style={{
          cursor: clickCount < 3 ? "pointer" : "default",
          width: width,
          height: width,
          backgroundColor: `rgb(${r},${g},${b})`,
          boxShadow: isOver?"5px 5px 5px 5px rgb(255,0,0)":"none"
        }}
        onClick={() => clickSource({ index, direction, r: 255, g: 0, b: 0 })}
      ></div>
    </Tooltip>
  );
});
export default SourceCell;

import { memo } from "react";
import Tooltip from "@mui/material/Tooltip";
import { useDrag } from "react-dnd";
import useGameService from "../service/GameService";
import "../App.css";
const TileCell = memo(function TileCell({ x, y, width, r, g, b }:{x:number;y:number;width:number;r:number;g:number;b:number}) {
  const { clickCount, closestTile } = useGameService();
  const [{ opacity }, drag] = useDrag(
    () => ({
      type: "draggable",
      item: { x, y, r, g, b },
      collect: (monitor) => ({
        opacity: monitor.isDragging() ? 0.4 : 1,
      }),
    }),
    [x, y, r, g, b]
  );

  return (
    <Tooltip title={r + "," + g + "," + b} placement="bottom-end">
      <div
        ref={clickCount === 3 ? drag : null}
        className="tile"
        style={{
          cursor: clickCount === 3 ? "pointer" : "default",
          width: width,
          height: width,
          opacity,
          borderStyle: closestTile?.x === x && closestTile?.y === y ? "solid" : "none",
          borderColor: closestTile?.x === x && closestTile?.y === y ? "red" : "white",
          backgroundColor: `rgb(${r},${g},${b})`,
        }}
      ></div>
    </Tooltip>
  );
});
export default TileCell;

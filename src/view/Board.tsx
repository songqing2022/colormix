import Tooltip from "@mui/material/Tooltip";
import TileCell from "./TileCell";
import SourceCell from "./SourceCell";
import useWindowDimension from "../util/useWindowDimension";
import useGameService from "../service/GameService";
import useUserService from "../service/UserService";
import GameOver from "./GameOver";
import SignIn from "./SignIn";
import "../App.css";

const Board = () => {
  const {sources, tiles, boardWidth, maxMoves, target, closestTile } = useGameService();

  const { cellWidth, width } = useWindowDimension(boardWidth);
  const { user } = useUserService();

  return (
    <>
      {user?.userId === 0 ? <SignIn /> : null}
      {maxMoves === 0 || closestTile?.diff < 0.1 ? <GameOver /> : null}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
        <div
          style={{
            display: "flex",
            flexDirection: width < 600 ? "column" : "row",
            justifyContent: "space-around",
            width: "60%",
          }}
        >
          <div>
            <span>User Id:</span>
            <span>{user["userId"]}</span>
          </div>
          <div>
            <span>Move Left:</span>
            <span>{maxMoves}</span>
          </div>
          <div style={{ display: "flex" }}>
            <span>Target Color:</span>
            {target ? (
              <Tooltip title={target[0] + "," + target[1] + "," + target[2]} placement="bottom-end">
                <div
                  style={{
                    width: 25,
                    height: 25,
                    backgroundColor: `
                  rgb(${target[0]},${target[1]},${target[2]})
                `,
                  }}
                ></div>
              </Tooltip>
            ) : null}
          </div>

          <div style={{ display: "flex" }}>
            <span>Closest Color:{closestTile?.diff ? Number(closestTile.diff * 100).toFixed(2) + "%" : ""}</span>
            {closestTile ? (
              <Tooltip
                title={closestTile["r"] + "," + closestTile["g"] + "," + closestTile["b"]}
                placement="bottom-end"
              >
                <div
                  style={{
                    width: 25,
                    height: 25,
                    backgroundColor: `
                    rgb(${closestTile["r"]},${closestTile["g"]},${closestTile["b"]})
                  `,
                  }}
                ></div>
              </Tooltip>
            ) : null}
          </div>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", marginTop: 40 }}>
        <div style={{ display: "flex" }}>
          <div id="left">
            <div className="source" style={{ height: cellWidth }} />
            <div style={{ display: "flex", flexDirection: "column" }}>
              {sources &&
                sources.length === 4 &&
                sources[3].map((c) => {
                  const cell = Object.assign({}, c, { width: cellWidth });
                  return <SourceCell key={c.index + "_" + c.direction} {...cell} />;
                })}
            </div>
            <div className="source" style={{ height: cellWidth }} />
          </div>
          <div id="middle">
            <div id="top_sources" style={{ display: "flex", justifyContent: "center" }}>
              {sources.length === 4 &&
                sources[0].map((c) => {
                  const cell = Object.assign({}, c, { width: cellWidth });
                  return <SourceCell key={c.index + "_" + c.direction} {...cell} />;
                })}
            </div>

            <div id="tiles" style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
              {tiles.map((row, index) => (
                <div key={index} style={{ display: "flex", justifyContent: "center" }}>
                  {row.map((c) => {
                    const cell = Object.assign({}, c, { width: cellWidth });
                    return <TileCell key={c.x + "_" + c.y} {...cell} />;
                  })}
                </div>
              ))}
            </div>
            <div id="bottom_sources" style={{ display: "flex", justifyContent: "center" }}>
              {sources.length === 4 &&
                sources[2].map((c) => {
                  const cell = Object.assign({}, c, { width: cellWidth });
                  return <SourceCell key={c.index + "_" + c.direction} {...cell} />;
                })}
            </div>
          </div>
          <div id="right">
            <div className="source" style={{ height: cellWidth }} />
            <div style={{ display: "flex", flexDirection: "column" }}>
              {sources.length === 4 &&
                sources[1].map((c) => {
                  const cell = Object.assign({}, c, { width: cellWidth });
                  return <SourceCell key={c.index + "_" + c.direction} {...cell} />;
                })}
            </div>
          </div>
          <div className="source" style={{ height: cellWidth }} />
        </div>
      </div>
    </>
  );
};
export default Board;

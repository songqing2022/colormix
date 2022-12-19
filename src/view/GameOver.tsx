import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import useUserService from "../service/UserService";
import useGameService from "../service/GameService";
export default function GameOver() {
  const { user, logout } = useUserService();
  const { closestTile, initGame, exitGame } = useGameService();
  const exit = () => {
    exitGame();
    logout();
  };
  const playAgain = async () => {
    const res = await fetch("http://localhost:9876/init/user/" + user["userId"]);
    const data = await res.json();
    initGame(data);
  };
  return (
    <>
      <Dialog open={true}>
        <DialogTitle>{closestTile?.diff < 0.1 ? "You win!" : "You lose"}</DialogTitle>
        <DialogActions>
          <Button onClick={exit}>Exit</Button>
          <Button onClick={playAgain}>Play Again</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

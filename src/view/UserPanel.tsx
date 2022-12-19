import Button from "@mui/material/Button";
import useUserService from "../service/UserService";
import useGameService from "../service/GameService";
export default function UserPanel() {
  const { user, logout } = useUserService();
  const { exitGame } = useGameService();
  const signout = () => {
    logout();
    exitGame();
  };
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: 60 }}>
      {user?.userId !== 0 ? (
        <Button variant="contained" onClick={signout}>
          Exit
        </Button>
      ) : null}
    </div>
  );
}

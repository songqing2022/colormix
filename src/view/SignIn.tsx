import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useUserService from "../service/UserService";
import useGameService from "../service/GameService";
export default function SignIn() {
  const { login } = useUserService();
  const { initGame } = useGameService();
  const start = async () => {
    const res = await fetch("http://localhost:9876/init");
    const data = await res.json();
    if (data?.userId) login({ userId: data["userId"] });
    initGame(data);
  };
  return (
    <>
      <Dialog open={true}>
        <DialogTitle></DialogTitle>
        <DialogContent>
          <DialogContentText>Welcome to PLay!</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={start}>Play Now</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

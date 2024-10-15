import { Snackbar } from "../snackbar";

interface snackbarComponentProps {
  showSnack: boolean;
  setShowSnack: (showSnack: boolean) => void;
}

const SnackbarComponent = ({
  showSnack,
  setShowSnack,
}: snackbarComponentProps) => (
  <Snackbar
    visible={showSnack}
    text={"Copied Retro Board Code"}
    status={"success"}
    onClose={() => setShowSnack(false)}
  />
);

export default SnackbarComponent;

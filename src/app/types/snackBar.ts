export interface SnackBar {
  message: string;
  status?: "success" | "info" | "warning" | "error" | null;
  visible: boolean;
  onClose: () => void;
  onOpen: () => void;
}

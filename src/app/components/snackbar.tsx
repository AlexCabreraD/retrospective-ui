import { useEffect } from "react";

interface SnackbarProps {
  visible: boolean;
  text: string;
  status?: "success" | "info" | "warning" | "error" | null;
  onClose: () => void;
  onOpen?: () => void;
}

export function Snackbar({
  visible,
  text,
  status,
  onClose,
  onOpen,
}: SnackbarProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green";
      case "info":
        return "bg-blue-500";
      case "warning":
        return "bg-yellow-500";
      case "error":
        return "bg-red-500";
      default:
        return "bg-green";
    }
  };

  useEffect(() => {
    if (visible) {
      if (onOpen) onOpen();
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  return (
    <div
      className={`fixed z-50 top-4 left-1/2 transform -translate-x-1/2 ${getStatusColor(
        status ?? "success",
      )} text-white px-4 py-2 rounded shadow-lg transition-transform duration-300 text-body w-fit whitespace-nowrap ${
        visible ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
      } md:text-body`}
    >
      {text}
    </div>
  );
}

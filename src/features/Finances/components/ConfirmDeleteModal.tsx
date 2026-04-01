import {
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  Button
} from "@mui/material";
import {
  dialogActionsSx,
  dialogTitleSx,
  modalCancelButtonSx,
  modalDangerButtonSx,
} from "./modalStyles";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmLabel?: string;
}

export default function ConfirmDeleteDialog({
  open,
  onClose,
  onConfirm,
  title = "Delete Account",
  message = "Are you sure you want to delete this account? This action cannot be undone.",
  confirmLabel = "Delete",
}: Props) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={dialogTitleSx}>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>

      <DialogActions sx={dialogActionsSx}>
        <Button variant="outlined" sx={modalCancelButtonSx} onClick={onClose}>Cancel</Button>
        <Button variant="contained" sx={modalDangerButtonSx} onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
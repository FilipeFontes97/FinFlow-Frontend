import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField
} from "@mui/material";
import { debtService } from "../services/debtService";
import { isValidDecimalInput, parseLocaleDecimal } from "../utils/numberInput";
import {
  dialogActionsSx,
  dialogTitleSx,
  modalCancelButtonSx,
  modalPrimaryButtonSx,
} from "./modalStyles";

interface Props {
  open: boolean;
  debtId: string | null;
  onClose: () => void;
  onCreated: () => void;
}

export default function AddPaymentModal({
  open,
  debtId,
  onClose,
  onCreated
}: Props) {
  const [amount, setAmount] = useState("");

  async function handleAdd() {
    if (!debtId || !amount) return;

    await debtService.addPayment(debtId, parseLocaleDecimal(amount));

    onCreated();
    onClose();
    setAmount("");
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={dialogTitleSx}>Add Payment</DialogTitle>

      <DialogContent>
        <TextField
          label="Amount (€)"
          type="text"
          inputMode="decimal"
          fullWidth
          autoFocus
          margin="dense"
          value={amount}
          onChange={(e) => {
            if (!isValidDecimalInput(e.target.value)) return;
            setAmount(e.target.value);
          }}
        />
      </DialogContent>

      <DialogActions sx={dialogActionsSx}>
        <Button variant="outlined" sx={modalCancelButtonSx} onClick={onClose}>Cancel</Button>
        <Button variant="contained" sx={modalPrimaryButtonSx} onClick={handleAdd}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}
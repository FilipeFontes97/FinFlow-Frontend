import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack
} from "@mui/material";
import { investmentService } from "../services/investmentService";
import {
  dialogActionsSx,
  dialogTitleSx,
  modalCancelButtonSx,
  modalPrimaryButtonSx,
} from "./modalStyles";

interface Props {
  open: boolean;
  financialAccountId: string;
  onClose: () => void;
  onAdded: () => void;
}

export default function AddInvestmentModal({
  open,
  financialAccountId,
  onClose,
  onAdded
}: Props) {
  const [amount, setAmount] = useState("");
  const [investmentDate, setInvestmentDate] = useState(() =>
    new Date().toISOString().split("T")[0]
  );

  async function handleAdd() {
    if (!amount) return;

    await investmentService.addInvestment({
      financialAccountId,
      amount: Number(amount),
      investmentDate
    });

    onAdded();
    onClose();
    setAmount("");
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={dialogTitleSx}>Add Investment</DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Amount (€)"
            type="number"
            fullWidth
            autoFocus
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <TextField
            label="Investment Date"
            type="date"
            fullWidth
            value={investmentDate}
            onChange={(e) => setInvestmentDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Stack>
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
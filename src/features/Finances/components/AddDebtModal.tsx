import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Stack
} from "@mui/material";
import { debtService } from "../services/debtService";
import {
  dialogActionsSx,
  dialogTitleSx,
  modalCancelButtonSx,
  modalPrimaryButtonSx,
} from "./modalStyles";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export default function AddDebtModal({ open, onClose, onCreated }: Props) {
  const [itemName, setItemName] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [paymentPortions, setPaymentPortions] = useState(1);
  const [notes, setNotes] = useState("");

  async function handleCreate() {
    if (!itemName || !totalAmount) return;

    await debtService.create({
      itemName,
      totalAmount: Number(totalAmount),
      paymentPortions,
      notes
    });

    onCreated();
    onClose();

    setItemName("");
    setTotalAmount("");
    setPaymentPortions(1);
    setNotes("");
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={dialogTitleSx}>Add Debt</DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Item"
            fullWidth
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />

          <TextField
            label="Total Amount (€)"
            type="number"
            fullWidth
            value={totalAmount}
            onChange={(e) => setTotalAmount(e.target.value)}
          />

          <TextField
            label="Split"
            select
            fullWidth
            value={paymentPortions}
            onChange={(e) => setPaymentPortions(Number(e.target.value))}
          >
            <MenuItem value={1}>One-time payment</MenuItem>
            <MenuItem value={3}>3x</MenuItem>
            <MenuItem value={6}>6x</MenuItem>
            <MenuItem value={12}>12x</MenuItem>
            <MenuItem value={24}>24x</MenuItem>
          </TextField>

          <TextField
            label="Notes"
            fullWidth
            multiline
            minRows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={dialogActionsSx}>
        <Button variant="outlined" sx={modalCancelButtonSx} onClick={onClose}>Cancel</Button>
        <Button variant="contained" sx={modalPrimaryButtonSx} onClick={handleCreate}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
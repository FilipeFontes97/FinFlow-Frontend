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
import { fixedExpensesService } from "../services/fixedExpensesService";
import type { CreateFixedExpenseRequest } from "../types/FixedExpenses";
import { isValidDecimalInput, parseLocaleDecimal } from "../utils/numberInput";
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

const fixedExpenseCategories = [
  { value: 0, label: "Taxes" },
  { value: 1, label: "Insurance" },
  { value: 2, label: "Fee" },
  { value: 3, label: "Rent" },
  { value: 4, label: "Mortgage" },
  { value: 5, label: "Utilities" },
  { value: 6, label: "Internet" },
  { value: 7, label: "Phone" },
  { value: 8, label: "Subscriptions" },
  { value: 9, label: "Car Payment" },
];

export default function AddFixedExpenseModal({ open, onClose, onCreated }: Props) {
  const [category, setCategory] = useState<number>(0);
  const [description, setDescription] = useState("");
  const [monthlyAmount, setMonthlyAmount] = useState("");
  const [paymentDay, setPaymentDay] = useState("");
  const [paymentDayError, setPaymentDayError] = useState("");
  const [notes, setNotes] = useState("");

  function validatePaymentDay(value: string): string {
    if (!value.trim()) return "";

    const day = Number(value);
    if (!Number.isInteger(day) || day < 1 || day > 31) {
      return "Payment day must be between 1 and 31";
    }

    return "";
  }

  async function handleCreate() {
    if (!monthlyAmount) return;

    const dayError = validatePaymentDay(paymentDay);
    setPaymentDayError(dayError);
    if (dayError) return;

    const payload: CreateFixedExpenseRequest = {
      category,
      description: description.trim() ? description.trim() : null,
      monthlyAmount: parseLocaleDecimal(monthlyAmount),
      paymentDay: paymentDay ? Number(paymentDay) : null,
      notes: notes.trim() ? notes.trim() : null,
    };

    await fixedExpensesService.create(payload);

    onCreated();
    onClose();

    setCategory(0);
    setDescription("");
    setMonthlyAmount("");
    setPaymentDay("");
    setPaymentDayError("");
    setNotes("");
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={dialogTitleSx}>Add Fixed Expense</DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            select
            label="Category"
            fullWidth
            value={category}
            onChange={(e) => setCategory(Number(e.target.value))}
          >
            {fixedExpenseCategories.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Description"
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <TextField
            label="Monthly Amount (€)"
            type="text"
            inputMode="decimal"
            fullWidth
            value={monthlyAmount}
            onChange={(e) => {
              if (!isValidDecimalInput(e.target.value)) return;
              setMonthlyAmount(e.target.value);
            }}
          />

          <TextField
            label="Payment Day (1-31)"
            type="number"
            fullWidth
            value={paymentDay}
            onChange={(e) => {
              const nextValue = e.target.value;
              setPaymentDay(nextValue);
              setPaymentDayError(validatePaymentDay(nextValue));
            }}
            error={Boolean(paymentDayError)}
            helperText={paymentDayError || "Optional"}
            inputProps={{ min: 1, max: 31 }}
          />

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

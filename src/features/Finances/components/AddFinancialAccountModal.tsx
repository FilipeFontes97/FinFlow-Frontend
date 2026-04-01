import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem
} from "@mui/material";

import { financialAccountService } from "../services/financialAccountService";
import type { CreateFinancialAccountRequest } from "../types/FinancialAccount";
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

export default function AddFinancialAccountModal({ open, onClose, onCreated }: Props) {

  const [form, setForm] = useState({
    name: "",
    type: "",
    valueInvested: "",
    currentValue: "",
    notes: ""
  });

  const [errors, setErrors] = useState({
    name: "",
    type: ""
  });

  function updateField(field: string, value: string | number | null) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  
type FormErrors = {
  name: string;
  type: string;
};

  function validate() {
    const newErrors: FormErrors = { name: "", type: "" };
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.type.trim()) newErrors.type = "Category is required";
    setErrors(newErrors);
    return !newErrors.name && !newErrors.type;
  }

  function numericInput(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: string
  ) {
    const v = e.target.value;
    if (/^[0-9]*\.?[0-9]*$/.test(v) || v === "") {
      updateField(field, v);
    }
  }

  async function handleSubmit() {
    if (!validate()) return;

    const invested = form.valueInvested === "" ? null : Number(form.valueInvested);
    const current = form.currentValue === "" ? invested : Number(form.currentValue);

    const payload: CreateFinancialAccountRequest = {
      name: form.name,
      type: form.type,
      valueInvested: invested,
      currentValue: current,
      notes: form.notes
    };

    await financialAccountService.create(payload);
    onCreated();
    onClose();

    setForm({
      name: "",
      type: "",
      valueInvested: "",
      currentValue: "",
      notes: ""
    });

    setErrors({ name: "", type: "" });
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={dialogTitleSx}>Add Financial Account</DialogTitle>

      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
      >
        <TextField
          label="Name"
          value={form.name}
          onChange={(e) => updateField("name", e.target.value)}
          error={Boolean(errors.name)}
          helperText={errors.name}
          required
          fullWidth
        />

        <TextField
          select
          label="Category"
          value={form.type}
          onChange={(e) => updateField("type", e.target.value)}
          error={Boolean(errors.type)}
          helperText={errors.type}
          required
          fullWidth
        >
          <MenuItem value="EmergencyFund">Emergency Fund</MenuItem>
          <MenuItem value="CheckingAccount">Checking Account</MenuItem>
          <MenuItem value="Savings">Savings</MenuItem>
          <MenuItem value="Crypto">Crypto</MenuItem>
          <MenuItem value="Stocks">Stocks</MenuItem>
          <MenuItem value="ETF">ETF</MenuItem>
          <MenuItem value="Cash">Cash</MenuItem>
          <MenuItem value="Other">Other</MenuItem>
        </TextField>

        <TextField
          label="Value Invested"
          type="text"
          inputMode="decimal"
          value={form.valueInvested}
          onChange={(e) => numericInput(e, "valueInvested")}
          fullWidth
        />

        <TextField
          label="Current Value"
          type="text"
          inputMode="decimal"
          value={form.currentValue}
          onChange={(e) => numericInput(e, "currentValue")}
          fullWidth
          helperText="If empty, it will match Value Invested"
        />

        <TextField
          label="Notes"
          multiline
          value={form.notes}
          onChange={(e) => updateField("notes", e.target.value)}
          fullWidth
        />
      </DialogContent>

      <DialogActions sx={dialogActionsSx}>
        <Button variant="outlined" sx={modalCancelButtonSx} onClick={onClose}>Cancel</Button>
        <Button variant="contained" sx={modalPrimaryButtonSx} onClick={handleSubmit}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}
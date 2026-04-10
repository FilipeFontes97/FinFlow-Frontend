import { useEffect, useState } from "react";
import { fixedExpensesService } from "../services/fixedExpensesService";
import {
  headerStyle,
  headerCellStyle,
  cellWithDivider,
  editableCell,
  editingCell,
  financePalette,
  pageHeaderSx,
  pagePanelCardSx,
  pageTopActionButtonSx,
} from "../styles";
import {
  Box,
  Button,
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  IconButton,
  Tooltip,
  TextField,
  MenuItem,
} from "@mui/material";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import type { FixedExpenseResponse } from "../types/FixedExpenses";
import AddFixedExpenseModal from "../components/AddFixedExpenseModal";
import ConfirmDeleteDialog from "../components/ConfirmDeleteModal";

const pageTitleSx = {
  margin: 0,
  fontSize: "2.6rem",
  fontWeight: 700,
  lineHeight: 1.1,
  color: "#0f172a",
  textShadow: "0 1px 2px rgba(255, 255, 255, 0.6)",
};

const summaryBoxSx = {
  padding: "0.6rem 1rem",
  borderRadius: "6px",
  backgroundColor: financePalette.neutralSoft,
  fontSize: "1.1rem",
  fontWeight: 600,
  whiteSpace: "nowrap",
};

const fixedExpenseCategoryLabels: Record<number, string> = {
  0: "Taxes",
  1: "Insurance",
  2: "Fee",
  3: "Rent",
  4: "Mortgage",
  5: "Utilities",
  6: "Internet",
  7: "Phone",
  8: "Subscriptions",
  9: "Car Payment",
};

function formatFixedExpenseCategory(category: string | number): string {
  if (typeof category === "number") {
    return fixedExpenseCategoryLabels[category] ?? String(category);
  }

  const numericCategory = Number(category);
  if (Number.isFinite(numericCategory) && category.trim() !== "") {
    return fixedExpenseCategoryLabels[numericCategory] ?? category;
  }

  return category;
}

function resolveCategoryToOptionValue(category: string | number | null | undefined): string {
  if (category == null) return "";

  if (typeof category === "number" && Number.isFinite(category)) {
    return String(category);
  }

  const raw = String(category).trim();
  if (!raw) return "";

  const numericCategory = Number(raw);
  if (Number.isFinite(numericCategory)) {
    return String(numericCategory);
  }

  const matchedEntry = Object.entries(fixedExpenseCategoryLabels).find(
    ([, label]) => label.toLowerCase() === raw.toLowerCase()
  );

  return matchedEntry ? matchedEntry[0] : raw;
}

export default function FixedExpensesList() {
  const [expenses, setExpenses] = useState<FixedExpenseResponse[]>([]);
  const [openAddExpense, setOpenAddExpense] = useState(false);
  const [openDeleteExpense, setOpenDeleteExpense] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<{ id: string; name: string } | null>(null);
  const [editing, setEditing] = useState<{
    id: string;
    field: "category" | "description" | "monthlyAmount" | "paymentDay" | "notes";
  } | null>(null);
  const [localEditValue, setLocalEditValue] = useState("");
  const [paymentDayInlineError, setPaymentDayInlineError] = useState("");

  async function loadExpenses() {
    const data = await fixedExpensesService.getAll();
    setExpenses(data);
  }

  function validatePaymentDay(value: string): string {
    if (!value.trim()) return "";

    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed < 1 || parsed > 31) {
      return "Payment day must be between 1 and 31";
    }

    return "";
  }

  function startEdit(
    id: string,
    field: "category" | "description" | "monthlyAmount" | "paymentDay" | "notes",
    initialValue: string | number | null | undefined
  ) {
    setEditing({ id, field });
    if (field === "category") {
      setLocalEditValue(resolveCategoryToOptionValue(initialValue));
    } else {
      setLocalEditValue(initialValue != null ? String(initialValue) : "");
    }
    setPaymentDayInlineError("");
  }

  async function saveInlineEdit(
    id: string,
    field: "category" | "description" | "monthlyAmount" | "paymentDay" | "notes",
    override?: string | number | null
  ) {
    const expense = expenses.find((e) => e.id === id);
    if (!expense) return;

    let value: string | number | null =
      override !== undefined ? override : localEditValue;

    if (field === "category") {
      const parsedCategory = Number(value);
      if (!Number.isFinite(parsedCategory)) return;
      value = parsedCategory;
    }

    if (field === "monthlyAmount") {
      const parsedAmount = Number(value);
      if (!Number.isFinite(parsedAmount)) return;
      value = parsedAmount;
    }

    if (field === "paymentDay") {
      const rawDay = String(value ?? "").trim();
      const dayError = validatePaymentDay(rawDay);
      setPaymentDayInlineError(dayError);
      if (dayError) return;
      value = rawDay === "" ? null : Number(rawDay);
    }

    if (field === "description" || field === "notes") {
      const textValue = String(value ?? "").trim();
      value = textValue === "" ? null : textValue;
    }

    const updatedCategory: string | number =
      field === "category" ? Number(value) : expense.category;

    const updatedDescription: string | null =
      field === "description"
        ? (value as string | null)
        : (expense.description ?? null);

    const updatedMonthlyAmount: number =
      field === "monthlyAmount" ? Number(value) : expense.monthlyAmount;

    const updatedPaymentDay: number | null =
      field === "paymentDay"
        ? (value as number | null)
        : (expense.paymentDay ?? null);

    const updatedNotes: string | null =
      field === "notes" ? (value as string | null) : (expense.notes ?? null);

    await fixedExpensesService.update(id, {
      category: updatedCategory,
      description: updatedDescription,
      monthlyAmount: updatedMonthlyAmount,
      paymentDay: updatedPaymentDay,
      notes: updatedNotes,
    });

    setEditing(null);
    setPaymentDayInlineError("");
    await loadExpenses();
  }

  function handleDeleteExpenseClick(id: string, description?: string | null) {
    setExpenseToDelete({
      id,
      name: description?.trim() || "this expense",
    });
    setOpenDeleteExpense(true);
  }

  async function confirmDeleteExpense() {
    if (!expenseToDelete) return;

    await fixedExpensesService.delete(expenseToDelete.id);
    await loadExpenses();
    setOpenDeleteExpense(false);
    setExpenseToDelete(null);
  }

  useEffect(() => {
    fixedExpensesService.getAll().then(setExpenses);
  }, []);

  const totalMonthly = expenses.reduce(
    (sum, e) => sum + e.monthlyAmount,
    0
  );

  return (
    <Box sx={{ width: "100%" }}>
      {/* HEADER */}
      <Box sx={pageHeaderSx}>
        <Typography component="h1" sx={pageTitleSx}>
          Fixed Expenses
        </Typography>

        <Box sx={summaryBoxSx}>
          Total Monthly: {" "}
          {totalMonthly.toLocaleString("pt-PT", {
            style: "currency",
            currency: "EUR"
          })}
        </Box>
      </Box>

      <Button
        variant="contained"
        size="small"
        startIcon={<ReceiptLongOutlinedIcon fontSize="small" />}
        onClick={() => setOpenAddExpense(true)}
        sx={{
          ...pageTopActionButtonSx,
          backgroundColor: "#475569",
          "&:hover": {
            backgroundColor: "#334155",
          },
        }}
      >
        Add Expense
      </Button>

      <TableContainer
        component={Paper}
        sx={{
          ...pagePanelCardSx,
          p: 0,
          overflow: "hidden",
        }}
      >
        <Table size="small">
          <TableHead sx={headerStyle}>
            <TableRow>
              <TableCell sx={{ ...headerCellStyle, ...cellWithDivider }}>Category</TableCell>
              <TableCell sx={{ ...headerCellStyle, ...cellWithDivider }}>Description</TableCell>
              <TableCell align="right" sx={{ ...headerCellStyle, ...cellWithDivider }}>Monthly (€)</TableCell>
              <TableCell sx={{ ...headerCellStyle, ...cellWithDivider }}>Payment Day</TableCell>
              <TableCell sx={{ ...headerCellStyle, ...cellWithDivider }}>Notes</TableCell>
              <TableCell sx={{ ...headerCellStyle, ...cellWithDivider }}>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {expenses.map(e => (
              <TableRow key={e.id}>
                <TableCell
                  sx={{ ...editableCell, ...cellWithDivider, fontWeight: 'bold' }}
                  onClick={() => startEdit(e.id, "category", e.category)}
                >
                  {editing?.id === e.id && editing.field === "category" ? (
                    <TextField
                      autoFocus
                      variant="standard"
                      select
                      sx={editingCell}
                      value={localEditValue}
                      onChange={(event) => {
                        const selected = event.target.value;
                        setLocalEditValue(selected);
                        saveInlineEdit(e.id, "category", selected);
                      }}
                    >
                      {Object.entries(fixedExpenseCategoryLabels).map(([value, label]) => (
                        <MenuItem key={value} value={value}>
                          {label}
                        </MenuItem>
                      ))}
                    </TextField>
                  ) : (
                    formatFixedExpenseCategory(e.category)
                  )}
                </TableCell>
                <TableCell
                  sx={{ ...editableCell, ...cellWithDivider }}
                  onClick={() => startEdit(e.id, "description", e.description ?? "")}
                >
                  {editing?.id === e.id && editing.field === "description" ? (
                    <TextField
                      autoFocus
                      variant="standard"
                      multiline
                      minRows={1}
                      maxRows={3}
                      sx={editingCell}
                      value={localEditValue}
                      onChange={(event) => setLocalEditValue(event.target.value)}
                      onBlur={() => saveInlineEdit(e.id, "description")}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" && !event.shiftKey) {
                          event.preventDefault();
                          saveInlineEdit(e.id, "description");
                        }
                      }}
                    />
                  ) : (
                    e.description?.trim() ? e.description : "-"
                  )}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ ...editableCell, ...cellWithDivider }}
                  onClick={() => startEdit(e.id, "monthlyAmount", e.monthlyAmount)}
                >
                  {editing?.id === e.id && editing.field === "monthlyAmount" ? (
                    <TextField
                      autoFocus
                      variant="standard"
                      type="text"
                      inputMode="decimal"
                      sx={editingCell}
                      value={localEditValue}
                      onChange={(event) => {
                        const value = event.target.value;
                        if (/^[0-9]*\.?[0-9]*$/.test(value) || value === "") {
                          setLocalEditValue(value);
                        }
                      }}
                      onBlur={() => saveInlineEdit(e.id, "monthlyAmount")}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          saveInlineEdit(e.id, "monthlyAmount");
                        }
                      }}
                    />
                  ) : (
                    e.monthlyAmount.toLocaleString("pt-PT", {
                      style: "currency",
                      currency: "EUR"
                    })
                  )}
                </TableCell>
                <TableCell
                  sx={{ ...editableCell, ...cellWithDivider }}
                  onClick={() => startEdit(e.id, "paymentDay", e.paymentDay ?? "")}
                >
                  {editing?.id === e.id && editing.field === "paymentDay" ? (
                    <TextField
                      autoFocus
                      variant="standard"
                      type="text"
                      inputMode="numeric"
                      sx={editingCell}
                      value={localEditValue}
                      onChange={(event) => {
                        const value = event.target.value;
                        if (/^\d*$/.test(value)) {
                          setLocalEditValue(value);
                          setPaymentDayInlineError(validatePaymentDay(value));
                        }
                      }}
                      onBlur={() => saveInlineEdit(e.id, "paymentDay")}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          saveInlineEdit(e.id, "paymentDay");
                        }
                      }}
                      error={Boolean(paymentDayInlineError)}
                      helperText={paymentDayInlineError}
                    />
                  ) : (
                    e.paymentDay ?? "-"
                  )}
                </TableCell>
                <TableCell
                  sx={{ ...editableCell, ...cellWithDivider }}
                  onClick={() => startEdit(e.id, "notes", e.notes ?? "")}
                >
                  {editing?.id === e.id && editing.field === "notes" ? (
                    <TextField
                      autoFocus
                      variant="standard"
                      multiline
                      minRows={1}
                      maxRows={3}
                      sx={editingCell}
                      value={localEditValue}
                      onChange={(event) => setLocalEditValue(event.target.value)}
                      onBlur={() => saveInlineEdit(e.id, "notes")}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" && !event.shiftKey) {
                          event.preventDefault();
                          saveInlineEdit(e.id, "notes");
                        }
                      }}
                    />
                  ) : (
                    e.notes ?? "-"
                  )}
                </TableCell>
                <TableCell sx={cellWithDivider}>
                  <Tooltip title="Delete expense">
                    <IconButton
                      size="small"
                      color="error"
                      aria-label="delete expense"
                      onClick={() => handleDeleteExpenseClick(e.id, e.description)}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}

            {expenses.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No fixed expenses
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <AddFixedExpenseModal
        open={openAddExpense}
        onClose={() => setOpenAddExpense(false)}
        onCreated={loadExpenses}
      />

      <ConfirmDeleteDialog
        open={openDeleteExpense}
        onClose={() => {
          setOpenDeleteExpense(false);
          setExpenseToDelete(null);
        }}
        onConfirm={confirmDeleteExpense}
        title="Delete Expense"
        message={`Are you sure you want to delete ${expenseToDelete?.name ? `"${expenseToDelete.name}"` : "this expense"}? This action cannot be undone.`}
        confirmLabel="Delete"
      />
    </Box>
  );
}
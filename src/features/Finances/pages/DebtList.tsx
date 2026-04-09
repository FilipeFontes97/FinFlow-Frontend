import { useEffect, useState } from "react";
import { debtService } from "../services/debtService";
import type { DebtResponse, PaymentPortionsValue } from "../types/Debt";
import type { Payment } from "../types/Debt";

import {
  Box,
  Button,
  Paper,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Typography,
  IconButton,
  Tooltip
} from "@mui/material";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import PriceCheckOutlinedIcon from "@mui/icons-material/PriceCheckOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

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

import AddDebtModal from "../components/AddDebtModal";
import AddPaymentModal from "../components/AddPaymentModal";
import PaymentHistoryModal from "../components/PaymentHistoryModal.tsx";
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

function isDebtPaid(debt: DebtResponse): boolean {
  // Small tolerance avoids floating point leftovers like 0.0000001.
  return debt.remainingAmount <= 0.009;
}

export default function DebtList() {
  const [debts, setDebts] = useState<DebtResponse[]>([]);
  const [openAddDebt, setOpenAddDebt] = useState(false);
  const [openAddPayment, setOpenAddPayment] = useState(false);
  const [selectedDebtId, setSelectedDebtId] = useState<string | null>(null);
  const [openHistory, setOpenHistory] = useState(false);
  const [selectedPayments, setSelectedPayments] = useState<Payment[]>([]);
  const [selectedDebtName, setSelectedDebtName] = useState("");
  const [openDeleteDebt, setOpenDeleteDebt] = useState(false);
  const [debtToDelete, setDebtToDelete] = useState<{ id: string; name: string } | null>(null);
  const [editingSplitDebtId, setEditingSplitDebtId] = useState<string | null>(null);
  const [localSplitValue, setLocalSplitValue] = useState<number>(1);
  const [editingNoteDebtId, setEditingNoteDebtId] = useState<string | null>(null);
  const [localNoteValue, setLocalNoteValue] = useState("");

  function resolvePaymentPortions(value: PaymentPortionsValue): number {
    const normalized = String(value).trim().toLowerCase();

    const digits = normalized.match(/\d+/)?.[0];
    if (digits) {
      return Number(digits);
    }

    const lettersOnly = normalized.replace(/[^a-z]/g, "");

    if (lettersOnly.includes("twentyfour") || lettersOnly.includes("vintequatro")) {
      return 24;
    }

    if (lettersOnly.includes("twelve") || lettersOnly.includes("doze")) {
      return 12;
    }

    if (lettersOnly.includes("six") || lettersOnly.includes("seis") || lettersOnly === "si") {
      return 6;
    }

    if (lettersOnly.includes("three") || lettersOnly.includes("tres")) {
      return 3;
    }

    if (lettersOnly.includes("one") || lettersOnly.includes("um")) {
      return 1;
    }

    return Number.NaN;
  }

  function formatSplitValue(value: PaymentPortionsValue) {
    const resolvedValue = resolvePaymentPortions(value);

    if (resolvedValue === 1) {
      return "One-time payment";
    }

    if (Number.isFinite(resolvedValue) && resolvedValue > 1) {
      return `${resolvedValue}x`;
    }

    const normalized = String(value).trim().toLowerCase();
    const lettersOnly = normalized.replace(/[^a-z]/g, "");

    return `${lettersOnly || normalized}x`;
  }

  async function loadDebts() {
    const data = await debtService.getAll();
    setDebts(data);
  }

  function handleDeleteDebtClick(id: string, itemName: string) {
    setDebtToDelete({ id, name: itemName });
    setOpenDeleteDebt(true);
  }

  async function confirmDeleteDebt() {
    if (!debtToDelete) return;
    await debtService.delete(debtToDelete.id);
    await loadDebts();
    setOpenDeleteDebt(false);
    setDebtToDelete(null);
  }

  function startNoteEdit(debtId: string, currentNote?: string) {
    setEditingNoteDebtId(debtId);
    setLocalNoteValue(currentNote ?? "");
  }

  function startSplitEdit(debtId: string, currentSplit: PaymentPortionsValue) {
    const resolvedValue = resolvePaymentPortions(currentSplit);
    setEditingSplitDebtId(debtId);
    setLocalSplitValue(Number.isFinite(resolvedValue) && resolvedValue > 0 ? resolvedValue : 1);
  }

  async function saveSplitEdit(debtId: string) {
    const debt = debts.find((d) => d.id === debtId);
    if (!debt) return;

    await debtService.update(debtId, {
      ...debt,
      paymentPortions: localSplitValue,
    });

    setEditingSplitDebtId(null);
    await loadDebts();
  }

  async function saveNoteEdit(debtId: string) {
    const debt = debts.find((d) => d.id === debtId);
    if (!debt) return;

    const normalizedPaymentPortions = resolvePaymentPortions(debt.paymentPortions);

    await debtService.update(debtId, {
      ...debt,
      paymentPortions:
        Number.isFinite(normalizedPaymentPortions) && normalizedPaymentPortions > 0
          ? normalizedPaymentPortions
          : 1,
      notes: localNoteValue,
    });

    setEditingNoteDebtId(null);
    await loadDebts();
  }

  function calculateNextInstallment(debt: DebtResponse): number {
    const paymentPortions = resolvePaymentPortions(debt.paymentPortions);

    if (!Number.isFinite(paymentPortions) || paymentPortions <= 1) {
    return debt.remainingAmount;
  }

    const installment = debt.totalAmount / paymentPortions;

  const roundedInstallment = Math.round(installment * 100) / 100;

  return Math.min(roundedInstallment, debt.remainingAmount);
}

async function payInstallment(debt: DebtResponse) {
  if (isDebtPaid(debt)) return;

  const amount = calculateNextInstallment(debt);

  if (amount <= 0) return;

  await debtService.addPayment(debt.id, amount);
  await loadDebts();
}

useEffect(() => {
  const fetchDebts = async () => {
    const data = await debtService.getAll();
    setDebts(data);
  };

  fetchDebts();
}, []);

  const totalRemaining = debts.reduce(
    (sum, d) => sum + d.remainingAmount,
    0
  );

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={pageHeaderSx}>
        <Typography component="h1" sx={pageTitleSx}>
          Debts
        </Typography>

        <Box
          sx={{
            ...summaryBoxSx,
            color: totalRemaining > 0 ? "error.main" : "text.secondary",
          }}
        >
         Debt:{" "}
          {totalRemaining.toLocaleString("pt-PT", {
            style: "currency",
            currency: "EUR",
          })}
        </Box>
      </Box>
      <Button
        variant="contained"
        size="small"
        startIcon={<ReceiptLongOutlinedIcon fontSize="small" />}
        sx={{
          ...pageTopActionButtonSx,
          backgroundColor: "#e89a9a",
          color: "#5f1d1d",
          "&:hover": {
            backgroundColor: "#dc8383",
          },
        }}
        onClick={() => setOpenAddDebt(true)}
      >
        Add Debt
      </Button>
      <TableContainer
        component={Paper}
        sx={{
          ...pagePanelCardSx,
          p: 0,
          overflow: "hidden",
        }}
      >
        <Table
          size="small"
          sx={{
            "& .MuiTableCell-root": {
              py: 0.75,
              px: 1,
            },
          }}
        >
          <TableHead sx={headerStyle}>
            <TableRow>
              <TableCell sx={{ ...headerCellStyle, ...cellWithDivider }}>
                Item
              </TableCell>
              <TableCell sx={{ ...headerCellStyle, ...cellWithDivider }}>
                Total
              </TableCell>
              <TableCell sx={{ ...headerCellStyle, ...cellWithDivider }}>
                Paid
              </TableCell>
              <TableCell sx={{ ...headerCellStyle, ...cellWithDivider }}>
                Remaining
              </TableCell>
              <TableCell sx={{ ...headerCellStyle, ...cellWithDivider }}>
                Split
              </TableCell>
              <TableCell sx={{ ...headerCellStyle, ...cellWithDivider }}>
                Notes
              </TableCell>
              <TableCell sx={{ ...headerCellStyle, ...cellWithDivider }}>
                Status
              </TableCell>
              <TableCell sx={{ ...headerCellStyle }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {debts.map((d) => (
              <TableRow key={d.id}>
                <TableCell sx={{ ...cellWithDivider }}>{d.itemName}</TableCell>

                <TableCell sx={{ ...cellWithDivider }}>
                  {d.totalAmount.toLocaleString("pt-PT", {
                    style: "currency",
                    currency: "EUR",
                  })}
                </TableCell>

                <TableCell sx={{ ...cellWithDivider }}>
                  {d.amountPaid.toLocaleString("pt-PT", {
                    style: "currency",
                    currency: "EUR",
                  })}
                </TableCell>

                <TableCell
                  sx={{
                    ...cellWithDivider,
                    fontWeight: 600,
                    color:
                      d.remainingAmount > 0
                        ? "error.main"
                        : "success.main",
                  }}
                >
                  {d.remainingAmount.toLocaleString("pt-PT", {
                    style: "currency",
                    currency: "EUR",
                  })}
                </TableCell>

                <TableCell
                  sx={{ ...editableCell, ...cellWithDivider }}
                  onClick={() => startSplitEdit(d.id, d.paymentPortions)}
                >
                  {editingSplitDebtId === d.id ? (
                    <TextField
                      autoFocus
                      variant="standard"
                      select
                      sx={editingCell}
                      value={localSplitValue}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => setLocalSplitValue(Number(e.target.value))}
                      onBlur={() => saveSplitEdit(d.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          e.currentTarget.blur();
                        }
                      }}
                    >
                      <MenuItem value={1}>One-time payment</MenuItem>
                      <MenuItem value={3}>3x</MenuItem>
                      <MenuItem value={6}>6x</MenuItem>
                      <MenuItem value={12}>12x</MenuItem>
                      <MenuItem value={24}>24x</MenuItem>
                    </TextField>
                  ) : (
                    <Box sx={{ lineHeight: 1.1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {formatSplitValue(d.paymentPortions)}
                        <Typography
                          component="span"
                          variant="caption"
                          color="text.secondary"
                          sx={{ ml: 0.75 }}
                        >
                          {`${d.payments?.length ?? 0} payment${(d.payments?.length ?? 0) === 1 ? "" : "s"}`}
                        </Typography>
                      </Typography>
                    </Box>
                  )}
                </TableCell>

                <TableCell
                  sx={{ ...editableCell, ...cellWithDivider }}
                  onClick={() => startNoteEdit(d.id, d.notes)}
                >
                  {editingNoteDebtId === d.id ? (
                    <TextField
                      autoFocus
                      variant="standard"
                      multiline
                      minRows={1}
                      maxRows={3}
                      sx={editingCell}
                      value={localNoteValue}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => setLocalNoteValue(e.target.value)}
                      onBlur={() => saveNoteEdit(d.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          e.currentTarget.blur();
                        }
                      }}
                    />
                  ) : (
                    d.notes?.trim() ? d.notes : "-"
                  )}
                </TableCell>

                <TableCell sx={{ ...cellWithDivider }}>
                  <Chip
                    size="small"
                    label={
                      isDebtPaid(d)
                        ? "Paid"
                        : "In Debt"
                    }
                    color={
                      isDebtPaid(d)
                        ? "success"
                        : "warning"
                    }
                  />
                </TableCell>

                <TableCell>
                  <Tooltip title="Add Payment">
                    <span>
                      <IconButton
                        size="small"
                        color="primary"
                        aria-label="add payment"
                        disabled={isDebtPaid(d)}
                        onClick={() => {
                          setSelectedDebtId(d.id);
                          setOpenAddPayment(true);
                        }}
                      >
                        <PaymentsOutlinedIcon fontSize="small" />
                      </IconButton>
                    </span>
                  </Tooltip>
                  <Tooltip title={`Pay ${formatSplitValue(d.paymentPortions)}`}>
                      <span>
                        <IconButton
                          size="small"
                          color="success"
                          aria-label="pay next installment"
                          disabled={isDebtPaid(d)}
                          onClick={() => payInstallment(d)}
                        >
                          <PriceCheckOutlinedIcon fontSize="small" />
                        </IconButton>
                      </span>
                  </Tooltip>
                  <Tooltip title="View payment history">
                    <IconButton
                      size="small"
                      color="secondary"
                      onClick={() => {
                        setSelectedDebtName(d.itemName);
                        setSelectedPayments(d.payments);
                        setOpenHistory(true);
                      }}
                    >
                      <ReceiptLongOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete debt">
                    <IconButton
                      size="small"
                      color="error"
                      aria-label="delete debt"
                      onClick={() => handleDeleteDebtClick(d.id, d.itemName)}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}

            {debts.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No debts found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* MODALS */}
      <AddDebtModal
        open={openAddDebt}
        onClose={() => setOpenAddDebt(false)}
        onCreated={loadDebts}
      />

      <AddPaymentModal
        open={openAddPayment}
        debtId={selectedDebtId}
        onClose={() => setOpenAddPayment(false)}
        onCreated={loadDebts}
      />

      <PaymentHistoryModal
        open={openHistory}
        payments={selectedPayments}
        itemName={selectedDebtName}
        onClose={() => setOpenHistory(false)}
      />

      <ConfirmDeleteDialog
        open={openDeleteDebt}
        onClose={() => {
          setOpenDeleteDebt(false);
          setDebtToDelete(null);
        }}
        onConfirm={confirmDeleteDebt}
        title="Delete Debt"
        message={`Are you sure you want to delete ${debtToDelete?.name ? `"${debtToDelete.name}"` : "this debt"}? This action cannot be undone.`}
        confirmLabel="Delete"
      />
    </Box>
  );
}

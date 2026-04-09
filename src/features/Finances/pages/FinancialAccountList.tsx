import { useEffect, useState } from "react";
import { financialAccountService } from "../services/financialAccountService";
import {
  headerStyle,
  headerCellStyle,
  editableCell,
  editingCell,
  cellWithDivider,
  financePalette,
  pageHeaderSx,
  pagePanelCardSx,
  pageTopActionButtonSx,
} from "../styles";

import type {
  FinancialAccountResponse,
  FinancialAccountListResponse
} from "../types/FinancialAccount";

import {
  Button,
  MenuItem,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  IconButton,
  Tooltip
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SavingsOutlinedIcon from "@mui/icons-material/SavingsOutlined";

import ConfirmDeleteDialog from "../components/ConfirmDeleteModal";
import AddFinancialAccountModal from "../components/AddFinancialAccountModal";
import AddInvestmentModal from "../components/AddInvestmentModal";

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

export default function FinancialAccountList() {
  const [data, setData] = useState<FinancialAccountListResponse | null>(null);

  const [openAdd, setOpenAdd] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [openAddInvestment, setOpenAddInvestment] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState<string>("");

  const [editing, setEditing] = useState<{
    id: string;
    field: keyof FinancialAccountResponse;
  } | null>(null);

  const [localEditValue, setLocalEditValue] = useState<string>("");

  async function loadAccounts() {
    const accounts = await financialAccountService.getAll();
    setData(accounts);
  }

  function handleDeleteClick(id: string) {
    setSelectedId(id);
    setOpenDelete(true);
  }

  async function confirmDelete() {
    if (!selectedId) return;
    await financialAccountService.delete(selectedId);

    setOpenDelete(false);
    setSelectedId(null);

    financialAccountService.getAll().then(setData);
  }

  function startEdit(
    id: string,
    field: keyof FinancialAccountResponse,
    initialValue: string | number | null | undefined
  ) {
    setEditing({ id, field });
    setLocalEditValue(initialValue != null ? String(initialValue) : "");
  }

  async function saveInlineEdit(
    id: string,
    field: keyof FinancialAccountResponse,
    override?: string | number | null
  ) {
    if (!data) return;

    const account = data.financialAccountList.find((a) => a.id === id);
    if (!account) return;

    let value: string | number | null =
      override !== undefined ? override : localEditValue;

    if (field === "valueInvested" || field === "currentValue") {
      value = value === "" ? null : Number(value);
    }

    const updatedAccount = {
      ...account,
      [field]: value
    };

    await financialAccountService.update(id, {
      name: updatedAccount.name,
      type: updatedAccount.type,
      valueInvested: updatedAccount.valueInvested,
      currentValue: updatedAccount.currentValue,
      notes: updatedAccount.notes
    });

    setEditing(null);
    financialAccountService.getAll().then(setData);
  }

  useEffect(() => {
    financialAccountService.getAll().then(setData);
  }, []);

  function numericOnly(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    if (/^[0-9]*\.?[0-9]*$/.test(value) || value === "") {
      setLocalEditValue(value);
    }
  }

  function formatCategoryLabel(category: string) {
    return category.replace(/([a-z])([A-Z])/g, "$1 $2");
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={pageHeaderSx}>
        <Typography component="h1" sx={pageTitleSx}>
          Financial Accounts
        </Typography>

        <Box sx={summaryBoxSx}>
          Net Worth:{" "}
          {data
            ? data.totalCurrentValue.toLocaleString("pt-PT", {
                style: "currency",
                currency: "EUR",
              })
            : "-"}
        </Box>
      </Box>

      <Button
        variant="contained"
        size="small"
        startIcon={<SavingsOutlinedIcon fontSize="small" />}
        sx={{
          ...pageTopActionButtonSx,
          backgroundColor: "#059669",
          "&:hover": {
            backgroundColor: "#047857",
          },
        }}
        onClick={() => setOpenAdd(true)}
      >
        Add Account
      </Button>

      <AddFinancialAccountModal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onCreated={() => financialAccountService.getAll().then(setData)}
      />

      <AddInvestmentModal
        open={openAddInvestment}
        financialAccountId={selectedAccountId}
        onClose={() => setOpenAddInvestment(false)}
        onAdded={loadAccounts}
      />

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
              <TableCell sx={{ ...headerCellStyle, ...cellWithDivider }}>Category</TableCell>
              <TableCell sx={{ ...headerCellStyle, ...cellWithDivider }}>Value Invested</TableCell>
              <TableCell sx={{ ...headerCellStyle, ...cellWithDivider }}>Current Value</TableCell>
              <TableCell sx={{ ...headerCellStyle, ...cellWithDivider }}>Profit</TableCell>
              <TableCell sx={{ ...headerCellStyle, ...cellWithDivider }}>Notes</TableCell>
              <TableCell sx={{ ...headerCellStyle, ...cellWithDivider }}>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {data?.financialAccountList.map((acc) => (
              <TableRow key={acc.id}>
                <TableCell
                  sx={{ ...editableCell, ...cellWithDivider }}
                  onClick={() => startEdit(acc.id, "type", acc.type)}
                >
                  {editing?.id === acc.id && editing.field === "type" ? (
                    <TextField
                      autoFocus
                      variant="standard"
                      select
                      sx={editingCell}
                      value={localEditValue}
                      onChange={(e) => {
                        const selectedType = e.target.value;
                        setLocalEditValue(selectedType);
                        saveInlineEdit(acc.id, "type", selectedType);
                      }}
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
                  ) : (
                    formatCategoryLabel(acc.type)
                  )}
                </TableCell>
                <TableCell
                  sx={{ ...editableCell, ...cellWithDivider }}
                  onClick={() =>
                    startEdit(acc.id, "valueInvested", acc.valueInvested)
                  }
                >
                  {editing?.id === acc.id &&
                  editing.field === "valueInvested" ? (
                    <TextField
                      autoFocus
                      variant="standard"
                      type="text"
                      inputMode="decimal"
                      sx={editingCell}
                      value={localEditValue}
                      onChange={numericOnly}
                      onBlur={() =>
                        saveInlineEdit(acc.id, "valueInvested")
                      }
                      onKeyDown={(e) =>
                        e.key === "Enter" &&
                        saveInlineEdit(acc.id, "valueInvested")
                      }
                    />
                  ) : (
                    (acc.valueInvested ?? 0).toLocaleString("pt-PT", {
                      style: "currency",
                      currency: "EUR"
                    })
                  )}
                </TableCell>
                <TableCell
                  sx={{ ...editableCell, ...cellWithDivider }}
                  onClick={() =>
                    startEdit(acc.id, "currentValue", acc.currentValue)
                  }
                >
                  {editing?.id === acc.id &&
                  editing.field === "currentValue" ? (
                    <TextField
                      autoFocus
                      variant="standard"
                      type="text"
                      inputMode="decimal"
                      sx={editingCell}
                      value={localEditValue}
                      onChange={numericOnly}
                      onBlur={() =>
                        saveInlineEdit(acc.id, "currentValue")
                      }
                      onKeyDown={(e) =>
                        e.key === "Enter" &&
                        saveInlineEdit(acc.id, "currentValue")
                      }
                    />
                  ) : (
                    (acc.currentValue ?? acc.valueInvested ?? 0).toLocaleString(
                      "pt-PT",
                      { style: "currency", currency: "EUR" }
                    )
                  )}
                </TableCell>
                <TableCell sx={{ ...cellWithDivider }}>
                  {(acc.profit ?? 0).toLocaleString("pt-PT", {
                    style: "currency",
                    currency: "EUR"
                  })}
                </TableCell>
                <TableCell
                  sx={{ ...editableCell, ...cellWithDivider }}
                  onClick={() =>
                    startEdit(acc.id, "notes", acc.notes ?? "")
                  }
                >
                  {editing?.id === acc.id &&
                  editing.field === "notes" ? (
                    <TextField
                      autoFocus
                      variant="standard"
                      multiline
                      minRows={1}
                      maxRows={3}
                      sx={editingCell}
                      value={localEditValue}
                      onChange={(e) => setLocalEditValue(e.target.value)}
                      onBlur={() => saveInlineEdit(acc.id, "notes")}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          saveInlineEdit(acc.id, "notes");
                        }
                      }}
                    />
                  ) : (
                    acc.notes
                  )}
                </TableCell>
                <TableCell sx={{ ...cellWithDivider }}>
                  <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}>
                    <Box sx={{ width: 32, display: "flex", justifyContent: "center" }}>
                      {(
                        acc.type === "ETF" ||
                        acc.type === "Stocks" ||
                        acc.type === "Crypto"
                      ) && (
                        <Tooltip title="Add investment">
                          <IconButton
                            size="small"
                            color="success"
                            onClick={() => {
                              setSelectedAccountId(acc.id);
                              setOpenAddInvestment(true);
                            }}
                          >
                            <SavingsOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>

                    <Tooltip title="Delete">
                      <IconButton
                        color="error"
                        size="small"
                        aria-label="delete account"
                        onClick={() => handleDeleteClick(acc.id)}
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <ConfirmDeleteDialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={confirmDelete}
      />
    </Box>
  );
}
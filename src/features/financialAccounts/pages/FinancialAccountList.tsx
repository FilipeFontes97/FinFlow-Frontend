import { useEffect, useState } from "react";
import { financialAccountService } from "../services/financialAccountService";
import {
  headerStyle,
  headerCellStyle,
  editableCell,
  editingCell
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
  Box
} from "@mui/material";

import ConfirmDeleteDialog from "../components/ConfirmDeleteModal";
import AddFinancialAccountModal from "../components/AddFinancialAccountModal";

export default function FinancialAccountList() {
  const [data, setData] = useState<FinancialAccountListResponse | null>(null);

  const [openAdd, setOpenAdd] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [editing, setEditing] = useState<{
    id: string;
    field: keyof FinancialAccountResponse;
  } | null>(null);

  const [localEditValue, setLocalEditValue] = useState<string>("");

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
    <div style={{ padding: "2rem" }}>

      {data && (
        <Box
  sx={{ 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "space-between",
    position: "sticky",
    top: 0,
    zIndex: 5,
    backgroundColor: "white",
    paddingY: 1,
    borderBottom: "1px solid #ddd"
  }}
>
  <Box>
    <h1 style={{ margin: 0 }}>Financial Accounts</h1>
  </Box>

  {data && (
    <Box
      sx={{
        padding: "0.6rem 1rem",
        borderRadius: "6px",
        backgroundColor: "#f5f5f5",
        fontSize: "1.1rem",
        fontWeight: 600,
        whiteSpace: "nowrap"
      }}
    >
      Total Financeiro:{" "}
      {data.totalCurrentValue.toLocaleString("pt-PT", {
        style: "currency",
        currency: "EUR",
      })}
    </Box>
  )}

</Box>
    )}

    <Button
  variant="contained" 
  sx={{ mt: 2 }}
  onClick={() => setOpenAdd(true)}>
  Add Financial Account
</Button>

      <AddFinancialAccountModal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onCreated={() => financialAccountService.getAll().then(setData)}
      />

      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
          <TableHead sx={headerStyle}>
            <TableRow>
              <TableCell sx={headerCellStyle}>Category</TableCell>
              <TableCell sx={headerCellStyle}>Value Invested</TableCell>
              <TableCell sx={headerCellStyle}>Current Value</TableCell>
              <TableCell sx={headerCellStyle}>Profit</TableCell>
              <TableCell sx={headerCellStyle}>Notes</TableCell>
              <TableCell sx={headerCellStyle}>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {data?.financialAccountList.map((acc) => (
              <TableRow key={acc.id}>

                {/* ✅ CATEGORY */}
                <TableCell
                  sx={editableCell}
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

                {/* ✅ VALUE INVESTED */}
                <TableCell
                  sx={editableCell}
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

                {/* ✅ CURRENT VALUE */}
                <TableCell
                  sx={editableCell}
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

                {/* ✅ PROFIT */}
                <TableCell>
                  {(acc.profit ?? 0).toLocaleString("pt-PT", {
                    style: "currency",
                    currency: "EUR"
                  })}
                </TableCell>

                {/* ✅ NOTES */}
                <TableCell
                  sx={editableCell}
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

                {/* ✅ DELETE */}
                <TableCell>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => handleDeleteClick(acc.id)}
                  >
                    Delete
                  </Button>
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
    </div>
  );
}
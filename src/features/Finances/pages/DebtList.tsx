import { useEffect, useState } from "react";
import { debtService } from "../services/debtService";
import type { DebtResponse } from "../types/Debt";
import { DebtStatus } from "../types/Debt";
import { headerStyle, headerCellStyle, cellWithDivider } from "../styles";


import {
  Box, Button, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, Typography
} from "@mui/material";

const pageTitleSx = {
  margin: 0,
  fontSize: "3rem",
  fontWeight: 700,
  lineHeight: 1.1,
};

const summaryBoxSx = {
  padding: "0.6rem 1rem",
  borderRadius: "6px",
  backgroundColor: "#f5f5f5",
  fontSize: "1.1rem",
  fontWeight: 600,
  whiteSpace: "nowrap",
};

export default function DebtList() {
  const [debts, setDebts] = useState<DebtResponse[]>([]);

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
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          position: "sticky",
          top: 0,
          backgroundColor: "white",
          zIndex: 10,
          pb: 1,
          borderBottom: "1px solid #ddd"
        }}
      >
        <Box>
          <Typography component="h1" sx={pageTitleSx}>
            Debts
          </Typography>
        </Box>

        <Box
          sx={{
            ...summaryBoxSx,
            color: totalRemaining > 0 ? "error.main" : "text.secondary",
          }}
        >
          Debt:{" "}
          {totalRemaining.toLocaleString("pt-PT", {
            style: "currency",
            currency: "EUR"
          })}
        </Box>
      </Box>

      <Button variant="contained" sx={{ mb: 2 }}>
        Add Debt
      </Button>

      <TableContainer component={Paper}>
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
              <TableCell sx={{ ...headerCellStyle, ...cellWithDivider }}>Item</TableCell>
              <TableCell sx={{ ...headerCellStyle, ...cellWithDivider }}>Total</TableCell>
              <TableCell sx={{ ...headerCellStyle, ...cellWithDivider }}>Paid</TableCell>
              <TableCell sx={{ ...headerCellStyle, ...cellWithDivider }}>Remaining</TableCell>
              <TableCell sx={{ ...headerCellStyle, ...cellWithDivider }}>Split</TableCell>
              <TableCell sx={{ ...headerCellStyle, ...cellWithDivider }}>Last Payment</TableCell>
              <TableCell sx={{ ...headerCellStyle, ...cellWithDivider }}>Status</TableCell>
              <TableCell sx={{ ...headerCellStyle, ...cellWithDivider }}>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {debts.map(d => (
              <TableRow key={d.id}>
                <TableCell>{d.itemName}</TableCell>

                <TableCell>
                  {d.totalAmount.toLocaleString("pt-PT", {
                    style: "currency",
                    currency: "EUR"
                  })}
                </TableCell>

                <TableCell>
                  {d.amountPaid.toLocaleString("pt-PT", {
                    style: "currency",
                    currency: "EUR"
                  })}
                </TableCell>

                <TableCell
                  sx={{ fontWeight: 600, color: d.remainingAmount > 0 ? "error.main" : "success.main" }}
                >
                  {d.remainingAmount.toLocaleString("pt-PT", {
                    style: "currency",
                    currency: "EUR"
                  })}
                </TableCell>

                <TableCell>{d.paymentPortions}x</TableCell>

                <TableCell>
                  {d.lastPaymentDate
                    ? new Date(d.lastPaymentDate).toLocaleDateString("pt-PT")
                    : "-"}
                </TableCell>

                <TableCell>
                  <Chip
                    label={d.debtStatus === DebtStatus.Paid ? "Paid" : "In Debt"}
                    color={d.debtStatus === DebtStatus.Paid ? "success" : "warning"}
                    size="small"
                  />
                </TableCell>

                <TableCell>
                  <Button size="small">
                    Add Payment
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
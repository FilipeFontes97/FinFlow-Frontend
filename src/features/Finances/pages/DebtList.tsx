import { useEffect, useState } from "react";
import { debtService } from "../services/debtService";
import type { DebtResponse } from "../types/Debt";
import { DebtStatus } from "../types/Debt";


import {
  Box, Button, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip
} from "@mui/material";

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
          pb: 1
        }}
      >
        <Box>
          <h1 style={{ margin: 0 }}>Debts</h1>
        </Box>

        <Box
          sx={{
            px: 2,
            py: 1,
            borderRadius: 2,
            backgroundColor: "#f5f5f5",
            fontWeight: 600
          }}
        >
          Total em Dívida:{" "}
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
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Item</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Paid</TableCell>
              <TableCell>Remaining</TableCell>
              <TableCell>Split</TableCell>
              <TableCell>Last Payment</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
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
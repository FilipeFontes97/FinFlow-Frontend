import { useEffect, useState } from "react";
import { investmentReportService } from "../services/investmentReportingService";
import type { InvestmentSummary } from "../types/Investments";
import { headerStyle, headerCellStyle, cellWithDivider } from "../styles";

import {
  Box,
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography
} from "@mui/material";

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
  backgroundColor: "#f5f5f5",
  fontSize: "1.1rem",
  fontWeight: 600,
  whiteSpace: "nowrap",
};

export default function InvestmentByYear() {
  const [data, setData] = useState<InvestmentSummary | null>(null);

  useEffect(() => {
    investmentReportService.getByYear().then(setData);
  }, []);

  return (
    <Box sx={{ width: "100%" }}>
      {/* HEADER */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          pb: 1,
          position: "sticky",
          top: 0,
          backgroundColor: "transparent",
          zIndex: 10,
          borderBottom: "1px solid #ddd"
        }}
      >
        <Typography component="h1" sx={pageTitleSx}>
          Investment by Year
        </Typography>

        <Box sx={summaryBoxSx}>
          Total Invested: {" "}
          {data?.totalInvested.toLocaleString("pt-PT", {
            style: "currency",
            currency: "EUR"
          }) ?? "-"}
        </Box>
      </Box>

      {/* TABLE */}
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead sx={headerStyle}>
            <TableRow>
              <TableCell sx={{ ...headerCellStyle, ...cellWithDivider }}>Year</TableCell>
              <TableCell align="right" sx={{ ...headerCellStyle, ...cellWithDivider }}>
                Total in Year
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {data?.byYear.map((row) => (
              <TableRow key={row.year}>
                <TableCell sx={cellWithDivider}>{row.year}</TableCell>
                <TableCell align="right" sx={cellWithDivider}>
                  {row.totalInvested.toLocaleString("pt-PT", {
                    style: "currency",
                    currency: "EUR"
                  })}
                </TableCell>
              </TableRow>
            ))}

            {data && data.byYear.length === 0 && (
              <TableRow>
                <TableCell colSpan={2} align="center">
                  No investments found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
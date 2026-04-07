import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  CircularProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { financialAccountService } from "../services/financialAccountService";
import { debtService } from "../services/debtService";
import { fixedExpensesService } from "../services/fixedExpensesService";
import { investmentReportService } from "../services/investmentReportingService";
import type { FinancialAccountListResponse } from "../types/FinancialAccount";
import type { DebtResponse } from "../types/Debt";
import type { FixedExpenseResponse } from "../types/FixedExpenses";
import type { InvestmentSummary } from "../types/Investments";

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

function money(value: number) {
  return value.toLocaleString("pt-PT", {
    style: "currency",
    currency: "EUR",
  });
}

export default function HomeDashboard() {
  const [accounts, setAccounts] = useState<FinancialAccountListResponse | null>(null);
  const [debts, setDebts] = useState<DebtResponse[]>([]);
  const [fixedExpenses, setFixedExpenses] = useState<FixedExpenseResponse[]>([]);
  const [investmentsByYear, setInvestmentsByYear] = useState<InvestmentSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        const [accountsData, debtsData, fixedData, investmentsData] = await Promise.all([
          financialAccountService.getAll(),
          debtService.getAll(),
          fixedExpensesService.getAll(),
          investmentReportService.getByYear(),
        ]);

        setAccounts(accountsData);
        setDebts(debtsData);
        setFixedExpenses(fixedData);
        setInvestmentsByYear(investmentsData);
        setError("");
      } catch {
        setError("Could not load dashboard data right now.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const totalAssets = accounts?.totalCurrentValue ?? 0;
  const totalDebt = debts.reduce((sum, d) => sum + d.remainingAmount, 0);
  const totalMonthlyFixed = fixedExpenses.reduce((sum, e) => sum + e.monthlyAmount, 0);
  const netPosition = totalAssets - totalDebt;

  const accountTypeBars = useMemo(() => {
    const grouped = new Map<string, number>();
    for (const acc of accounts?.financialAccountList ?? []) {
      const key = acc.type || "Other";
      const value = acc.currentValue ?? acc.valueInvested ?? 0;
      grouped.set(key, (grouped.get(key) ?? 0) + value);
    }

    const rows = Array.from(grouped.entries())
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);

    const total = rows.reduce((sum, r) => sum + r.value, 0) || 1;
    const max = Math.max(...rows.map((r) => r.value), 1);
    return rows.map((row) => ({
      ...row,
      width: (row.value / max) * 100,
      percent: (row.value / total) * 100,
    }));
  }, [accounts]);

  const yearBars = useMemo(() => {
    const rows = [...(investmentsByYear?.byYear ?? [])].sort((a, b) => a.year - b.year);
    const max = Math.max(...rows.map((r) => r.totalInvested), 1);
    return rows.map((row) => ({
      ...row,
      height: Math.max(14, (row.totalInvested / max) * 100),
    }));
  }, [investmentsByYear]);

  return (
    <Box sx={{ width: "100%" }}>
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
          borderBottom: "1px solid #ddd",
        }}
      >
        <Typography component="h1" sx={pageTitleSx}>
          Home Dashboard
        </Typography>

        <Box
          sx={{
            ...summaryBoxSx,
            color: netPosition >= 0 ? "success.main" : "error.main",
          }}
        >
          Net Position: {money(netPosition)}
        </Box>
      </Box>

      {loading && (
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 3 }}>
          <CircularProgress size={20} />
          <Typography>Loading dashboard...</Typography>
        </Stack>
      )}

      {!loading && error && <Alert severity="warning">{error}</Alert>}

      {!loading && !error && (
        <Stack spacing={2}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(4, 1fr)" },
              gap: 2,
            }}
          >
            <Paper sx={{ p: 2 }}>
              <Typography variant="caption" color="text.secondary">Assets</Typography>
              <Typography variant="h6" fontWeight={700}>{money(totalAssets)}</Typography>
            </Paper>
            <Paper sx={{ p: 2 }}>
              <Typography variant="caption" color="text.secondary">Debt</Typography>
              <Typography variant="h6" fontWeight={700} color="error.main">{money(totalDebt)}</Typography>
            </Paper>
            <Paper sx={{ p: 2 }}>
              <Typography variant="caption" color="text.secondary">Monthly Fixed Expenses</Typography>
              <Typography variant="h6" fontWeight={700}>{money(totalMonthlyFixed)}</Typography>
            </Paper>
            <Paper sx={{ p: 2 }}>
              <Typography variant="caption" color="text.secondary">All-Time Invested</Typography>
              <Typography variant="h6" fontWeight={700}>{money(investmentsByYear?.totalInvested ?? 0)}</Typography>
            </Paper>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "1.2fr 1fr" },
              gap: 2,
            }}
          >
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1.5 }}>
                Asset Allocation by Account Type
              </Typography>
              <Stack spacing={1.25}>
                {accountTypeBars.length === 0 && (
                  <Typography color="text.secondary">No account data yet.</Typography>
                )}
                {accountTypeBars.map((bar) => (
                  <Box key={bar.label}>
                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                      <Typography variant="body2">{bar.label}</Typography>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="body2" color="text.secondary">
                          {bar.percent.toFixed(1)}%
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>{money(bar.value)}</Typography>
                      </Stack>
                    </Stack>
                    <Box sx={{ height: 10, borderRadius: 10, backgroundColor: "#e2e8f0" }}>
                      <Box
                        sx={{
                          height: "100%",
                          width: `${bar.width}%`,
                          borderRadius: 10,
                          background: "linear-gradient(90deg, #16a34a, #22c55e)",
                        }}
                      />
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Paper>

            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1.5 }}>
                Investments by Year
              </Typography>

              {yearBars.length === 0 && (
                <Typography color="text.secondary">No investment records yet.</Typography>
              )}

              {yearBars.length > 0 && (
                <Box
                  sx={{
                    height: 190,
                    display: "flex",
                    alignItems: "flex-end",
                    gap: 1,
                    borderBottom: "1px solid #e2e8f0",
                    pt: 1,
                  }}
                >
                  {yearBars.map((row) => (
                    <Box
                      key={row.year}
                      sx={{
                        flex: 1,
                        minWidth: 34,
                        textAlign: "center",
                      }}
                    >
                      <Box
                        sx={{
                          mx: "auto",
                          width: "70%",
                          height: `${row.height}%`,
                          minHeight: 14,
                          borderRadius: "6px 6px 0 0",
                          background: "linear-gradient(180deg, #0ea5e9, #0284c7)",
                        }}
                      />
                      <Typography variant="caption" sx={{ mt: 0.5, display: "block" }}>
                        {row.year}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </Paper>
          </Box>
        </Stack>
      )}
    </Box>
  );
}

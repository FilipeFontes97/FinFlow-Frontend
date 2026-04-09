import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  CircularProgress,
  Paper,
  Stack,
  Typography
} from "@mui/material";

import { dashboardService } from "../services/dashboardService";
import type { DashboardOverview } from "../services/dashboardService";
import DashboardSignals from "../components/DashboardSignals";

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
  const [dashboard, setDashboard] = useState<DashboardOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        const data = await dashboardService.getOverview();
        setDashboard(data);
        setError("");
      } catch {
        setError("Could not load dashboard data right now.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 3 }}>
        <CircularProgress size={20} />
        <Typography>Loading dashboard...</Typography>
      </Stack>
    );
  }

  if (!loading && error) {
    return <Alert severity="warning">{error}</Alert>;
  }

  if (!dashboard) return null;

  const assets = dashboard.assets;
  const debts = dashboard.debts;
  const monthlyFixed = dashboard.monthlyFixedExpenses;
  const allTimeInvested = dashboard.allTimeInvested;
  const netPosition = dashboard.netPosition;
  const maxYearlyInvestment = Math.max(
    ...dashboard.investmentsByYear.map((row) => row.totalInvested),
    1
  );

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

      <Stack spacing={2}>
        {/* KPI CARDS */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(4, 1fr)" },
            gap: 2,
          }}
        >
          <Paper sx={{ p: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Net Worth
            </Typography>
            <Typography variant="h6" fontWeight={700}>
              {money(assets)}
            </Typography>
          </Paper>

          <Paper sx={{ p: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Debt
            </Typography>
            <Typography variant="h6" fontWeight={700} color="error.main">
              {money(debts)}
            </Typography>
          </Paper>

          <Paper sx={{ p: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Monthly Fixed Expenses
            </Typography>
            <Typography variant="h6" fontWeight={700}>
              {money(monthlyFixed)}
            </Typography>
          </Paper>

          <Paper sx={{ p: 2 }}>
            <Typography variant="caption" color="text.secondary">
              All-Time Invested
            </Typography>
            <Typography variant="h6" fontWeight={700}>
              {money(allTimeInvested)}
            </Typography>
          </Paper>
        </Box>

        {/* GRAPHS */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "1.2fr 1fr" },
            gap: 2,
          }}
        >
          {/* ASSET ALLOCATION */}
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1.5 }}>
              Asset Allocation by Account Type
            </Typography>

            <Stack spacing={1.25}>
              {dashboard.assetAllocation.map(bar => (
                <Box key={bar.accountType}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    sx={{ mb: 0.5 }}
                  >
                    <Typography variant="body2">
                      {bar.accountType}
                    </Typography>

                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="body2" color="text.secondary">
                        {bar.percentage.toFixed(1)}%
                      </Typography>

                      <Typography variant="body2" fontWeight={600}>
                        {money(bar.amount)}
                      </Typography>
                    </Stack>
                  </Stack>

                  <Box
                    sx={{
                      height: 10,
                      borderRadius: 10,
                      backgroundColor: "#e2e8f0",
                    }}
                  >
                    <Box
                      sx={{
                        height: "100%",
                        width: `${bar.percentage}%`,
                        borderRadius: 10,
                        background:
                          "linear-gradient(90deg, #16a34a, #22c55e)",
                      }}
                    />
                  </Box>
                </Box>
              ))}
            </Stack>
          </Paper>

          {/* INVESTMENTS BY YEAR */}
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1.5 }}>
              Investments by Year
            </Typography>

            <Box
              sx={{
                height: 220,
                display: "flex",
                alignItems: "flex-end",
                gap: 1,
                borderBottom: "1px solid #e2e8f0",
                pt: 1,
              }}
            >
              {dashboard.investmentsByYear.map(row => (
                <Box
                  key={row.year}
                  sx={{
                    flex: 1,
                    height: "100%",
                    minWidth: 34,
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      mb: 0.75,
                      display: "block",
                      fontWeight: 600,
                      color: "#334155",
                      lineHeight: 1.2,
                    }}
                  >
                    {money(row.totalInvested)}
                  </Typography>
                  <Box
                    sx={{
                      flex: 1,
                      display: "flex",
                      alignItems: "flex-end",
                      justifyContent: "center",
                    }}
                  >
                  <Box
                    sx={{
                      width: "70%",
                      height: `${
                        (row.totalInvested /
                          maxYearlyInvestment) *
                        100
                      }%`,
                      minHeight: 14,
                      borderRadius: "6px 6px 0 0",
                      background:
                        "linear-gradient(180deg, #0ea5e9, #0284c7)",
                    }}
                  />
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{ mt: 0.5, display: "block" }}
                  >
                    {row.year}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Box>

        {/* ✅ DASHBOARD SIGNALS */}
        <DashboardSignals signals={dashboard.signals ?? []} />
      </Stack>
    </Box>
  );
}
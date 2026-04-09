import { Box, Divider, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import RequestQuoteOutlinedIcon from "@mui/icons-material/RequestQuoteOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import { financePalette, pagePanelCardSx } from "../styles";
import finflowLogo from "../../../assets/finflowlogo.png";
import { settingsService } from "../services/settingsService";

const features = [
  {
    icon: <DashboardOutlinedIcon sx={{ fontSize: 32, color: financePalette.primary }} />,
    title: "Dashboard",
    description: "Get a full financial overview with key metrics, signals, and investment trends at a glance.",
    path: "/dashboard",
  },
  {
    icon: <AccountBalanceOutlinedIcon sx={{ fontSize: 32, color: financePalette.primary }} />,
    title: "Accounts",
    description: "Track and manage your financial accounts — balances, types, and associated banks.",
    path: "/accounts",
  },
  {
    icon: <RequestQuoteOutlinedIcon sx={{ fontSize: 32, color: financePalette.primary }} />,
    title: "Fixed Expenses",
    description: "Monitor recurring monthly expenses so you always know where your money goes.",
    path: "/fixed-expenses",
  },
  {
    icon: <CreditCardOutlinedIcon sx={{ fontSize: 32, color: financePalette.primary }} />,
    title: "Debts",
    description: "Stay on top of your debts with payment tracking and remaining balance visibility.",
    path: "/debts",
  },
  {
    icon: <TrendingUpOutlinedIcon sx={{ fontSize: 32, color: financePalette.primary }} />,
    title: "Investment Records",
    description: "Review yearly investment totals and track how your portfolio grows over time.",
    path: "/investments-by-year",
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    const loadUserName = async () => {
      try {
        const settings = await settingsService.get();
        setUserName(settings.name || "");
      } catch {
        setUserName("");
      }
    };

    loadUserName();
  }, []);

  return (
    <Box sx={{ maxWidth: 860, mx: "auto", py: 4 }}>
      {/* Hero */}
      <Box
        sx={{
          ...pagePanelCardSx,
          mb: 4,
          py: { xs: 2.5, md: 3 },
          px: { xs: 2, md: 3 },
          background: `linear-gradient(135deg, rgba(8,168,16,0.08) 0%, rgba(255,255,255,1) 60%)`,
          borderTop: `3px solid ${financePalette.primary}`,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            gap: { xs: 1.5, md: 2.5 },
          }}
        >
          <Box
            sx={{
              width: { xs: "100%", md: 250 },
              flexShrink: 0,
              textAlign: "center",
            }}
          >
            <Box
              component="img"
              src={finflowLogo}
              alt="FinFlow"
              sx={{
                width: { xs: 165, md: 250 },
                height: "auto",
                maxWidth: "100%",
                display: "inline-block",
              }}
            />
          </Box>

          <Box sx={{ textAlign: { xs: "center", md: "left" }, minWidth: 0, flex: 1 }}>
            <Typography variant="h5" fontWeight={700} color="#0f172a" sx={{ mb: 0.5 }}>
              Welcome {userName}!
            </Typography>
            <Typography variant="body2" color="#475569" sx={{ maxWidth: 640, mb: 1.5 }}>
              Your personal finance command center. Track accounts, control expenses, manage debts, and watch your investments grow in one place.
            </Typography>
            {/* <Button
              variant="contained"
              size="medium"
              onClick={() => navigate("/dashboard")}
              startIcon={<DashboardOutlinedIcon />}
              sx={{
                backgroundColor: financePalette.primary,
                borderRadius: "10px",
                textTransform: "none",
                fontWeight: 600,
                px: 2.5,
                "&:hover": { backgroundColor: financePalette.primaryDark },
              }}
            >
              Go to Dashboard
            </Button> */}
          </Box>
        </Box>
      </Box>

      <Divider sx={{ mb: 4 }}>
        <Typography variant="caption" color="#0f0f0f" fontWeight={600} letterSpacing="0.08em" textTransform="uppercase">
          What you can do
        </Typography>
      </Divider>

      {/* Feature cards */}
      <Grid container spacing={2}>
        {features.map((f) => (
          <Grid size={{ xs: 12, sm: 6 }} key={f.title}>
            <Box
              onClick={() => navigate(f.path)}
              sx={{
                ...pagePanelCardSx,
                display: "flex",
                alignItems: "flex-start",
                gap: 2,
                cursor: "pointer",
                transition: "all 0.15s ease",
                "&:hover": {
                  borderColor: financePalette.primary,
                  boxShadow: `0 4px 16px rgba(8,168,16,0.12)`,
                  transform: "translateY(-2px)",
                },
              }}
            >
              <Box sx={{ mt: 0.5, flexShrink: 0 }}>{f.icon}</Box>
              <Box>
                <Typography variant="subtitle1" fontWeight={700} color="#0f172a">
                  {f.title}
                </Typography>
                <Typography variant="body2" color="#64748b">
                  {f.description}
                </Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

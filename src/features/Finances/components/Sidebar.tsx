import { useState } from "react";
import { Box, Collapse, Drawer, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import RequestQuoteOutlinedIcon from "@mui/icons-material/RequestQuoteOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useLocation, useNavigate } from "react-router-dom";
import sidebarMoneyBg from "../../../assets/moneypattern.jpg";
import finflowLogo from "../../../assets/finflowlogo.png";

const drawerWidth = 220;

function navItemSx(selected: boolean, nested = false) {
  return {
    mb: 0.5,
    px: 1,
    pl: nested ? 3 : 1,
    py: 0.6,
    borderRadius: "8px",
    mx: 0.8,
    color: selected ? "#0f172a" : "#334155",
    backgroundColor: selected ? "rgba(8, 168, 16, 0.14)" : "transparent",
    borderLeft: selected ? "3px solid #08a810" : "3px solid transparent",
    transition: "all 0.16s ease",
    "&:hover": {
      backgroundColor: selected ? "rgba(8, 168, 16, 0.18)" : "rgba(15, 23, 42, 0.06)",
    },
    "& .MuiListItemIcon-root": {
      minWidth: 34,
      color: selected ? "#08a810" : "#475569",
    },
    "& .MuiListItemText-primary": {
      fontWeight: selected ? 700 : 600,
      fontSize: "0.92rem",
      letterSpacing: "0.01em",
    },
  };
}

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const isManagementRoute = [
    "/accounts",
    "/fixed-expenses",
    "/investments-by-year",
    "/debts",
  ].includes(location.pathname);

  const [openManagementOffRoute, setOpenManagementOffRoute] = useState(false);
  const [collapseOnManagementRoute, setCollapseOnManagementRoute] = useState(false);

  const openManagement = isManagementRoute
    ? !collapseOnManagementRoute
    : openManagementOffRoute;

  const handleToggleManagement = () => {
    if (isManagementRoute) {
      setCollapseOnManagementRoute((prev) => !prev);
      return;
    }

    setOpenManagementOffRoute((prev) => !prev);
  };

  const navigateToManagement = (path: string) => {
    setCollapseOnManagementRoute(false);
    navigate(path);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.86), rgba(255, 255, 255, 0.86)), url(${sidebarMoneyBg})`,
          borderRight: "1px solid rgba(255, 255, 255, 0.86)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        },
      }}
    >
      <Box
        onClick={() => navigate("/")}
        sx={{
          p: 1.5,
          textAlign: "center",
          borderBottom: "1px solid rgba(255, 255, 255, 0.65)",
          backgroundColor: "rgba(255, 255, 255, 0.42)",
          cursor: "pointer",
        }}
      >
        <img src={finflowLogo} alt="FinFlow Logo" style={{ height: 66, width: "auto" }} />
      </Box>
      <List sx={{ mt: 0, p: 0 }}>
        <ListItemButton
          selected={location.pathname === "/"}
          onClick={() => navigate("/")}
          sx={navItemSx(location.pathname === "/")}
        >
          <ListItemIcon>
            <HomeOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItemButton>

        <ListItemButton
          selected={isManagementRoute}
          onClick={handleToggleManagement}
          sx={navItemSx(isManagementRoute)}
        >
          <ListItemIcon>
            <ManageAccountsOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="Management" />
          {openManagement ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </ListItemButton>

        <Collapse in={openManagement} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton
              selected={location.pathname === "/accounts"}
              onClick={() => navigateToManagement("/accounts")}
              sx={navItemSx(location.pathname === "/accounts", true)}
            >
              <ListItemIcon>
                <AccountBalanceIcon />
              </ListItemIcon>
              <ListItemText primary="Accounts" />
            </ListItemButton>

            <ListItemButton
              selected={location.pathname === "/fixed-expenses"}
              onClick={() => navigateToManagement("/fixed-expenses")}
              sx={navItemSx(location.pathname === "/fixed-expenses", true)}
            >
              <ListItemIcon>
                <RequestQuoteOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="Fixed Expenses" />
            </ListItemButton>

            <ListItemButton
              selected={location.pathname === "/debts"}
              onClick={() => navigateToManagement("/debts")}
              sx={navItemSx(location.pathname === "/debts", true)}
            >
              <ListItemIcon>
                <CreditCardIcon />
              </ListItemIcon>
              <ListItemText primary="Debts" />
            </ListItemButton>

                        <ListItemButton
              selected={location.pathname === "/investments-by-year"}
              onClick={() => navigateToManagement("/investments-by-year")}
              sx={navItemSx(location.pathname === "/investments-by-year", true)}
            >
              <ListItemIcon>
                <ReceiptLongOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="Investment Records" />
            </ListItemButton>

          </List>
        </Collapse>

        <ListItemButton
          selected={location.pathname === "/settings"}
          onClick={() => navigate("/settings")}
          sx={navItemSx(location.pathname === "/settings")}
        >
          <ListItemIcon>
            <SettingsOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItemButton>

      </List>
    </Drawer>
  );
}
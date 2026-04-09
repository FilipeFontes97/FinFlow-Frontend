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
          borderBottom: "1px solid rgba(255, 255, 255, 0.6)",
          cursor: "pointer",
        }}
      >
        <img src={finflowLogo} alt="FinFlow Logo" style={{ height: 50, width: "auto" }} />
      </Box>
      <List sx={{ mt: 0, p: 0 }}>
        <ListItemButton
          selected={location.pathname === "/"}
          onClick={() => navigate("/")}
          sx={{ mb: 1, px: 1 }}
        >
          <ListItemIcon>
            <HomeOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItemButton>

        <ListItemButton
          selected={isManagementRoute}
          onClick={handleToggleManagement}
          sx={{ mb: 1, px: 1 }}
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
              sx={{ mb: 1, px: 1, pl: 3 }}
            >
              <ListItemIcon>
                <AccountBalanceIcon />
              </ListItemIcon>
              <ListItemText primary="Accounts" />
            </ListItemButton>

            <ListItemButton
              selected={location.pathname === "/fixed-expenses"}
              onClick={() => navigateToManagement("/fixed-expenses")}
              sx={{ mb: 1, px: 1, pl: 3 }}
            >
              <ListItemIcon>
                <RequestQuoteOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="Fixed Expenses" />
            </ListItemButton>

            <ListItemButton
              selected={location.pathname === "/investments-by-year"}
              onClick={() => navigateToManagement("/investments-by-year")}
              sx={{ mb: 1, px: 1, pl: 3 }}
            >
              <ListItemIcon>
                <ReceiptLongOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="Investment Records" />
            </ListItemButton>

            <ListItemButton
              selected={location.pathname === "/debts"}
              onClick={() => navigateToManagement("/debts")}
              sx={{ mb: 1, px: 1, pl: 3 }}
            >
              <ListItemIcon>
                <CreditCardIcon />
              </ListItemIcon>
              <ListItemText primary="Debts" />
            </ListItemButton>

          </List>
        </Collapse>

        <ListItemButton
          selected={location.pathname === "/settings"}
          onClick={() => navigate("/settings")}
          sx={{ mb: 1, px: 1 }}
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
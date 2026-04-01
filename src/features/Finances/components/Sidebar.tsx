import { Drawer, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import { useLocation, useNavigate } from "react-router-dom";
import sidebarMoneyBg from "../../../assets/moneypattern.jpg";

const drawerWidth = 220;

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

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
      <List sx={{ mt: 0, p: 0 }}>
        <ListItemButton
          selected={location.pathname === "/"}
          onClick={() => navigate("/")}
          sx={{ mb: 1, px: 1 }}
        >
          <ListItemIcon>
            <AccountBalanceIcon />
          </ListItemIcon>
          <ListItemText primary="Accounts" />
        </ListItemButton>

        <ListItemButton
          selected={location.pathname === "/debts"}
          onClick={() => navigate("/debts")}
          sx={{ mb: 1, px: 1 }}
        >
          <ListItemIcon>
            <CreditCardIcon />
          </ListItemIcon>
          <ListItemText primary="Debts" />
        </ListItemButton>
      </List>
    </Drawer>
  );
}
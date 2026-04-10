import { Box, CssBaseline } from "@mui/material";
import { Outlet } from "react-router-dom";
import Sidebar from "../features/Finances/components/Sidebar";
import FloatingCalculatorButton from "../features/Finances/components/FloatingCalculatorButton";
import FloatingCalculatorPanel from "../features/Finances/components/FloatingCalculatorPanel";
import sharkBg from "../assets/sharkbackground.png";

export default function AppLayout() {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <CssBaseline />
      <Sidebar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: "100%",
          p: 3,
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.37), rgba(255, 255, 255, 0.38)), url(${sharkBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <Outlet />
      </Box>

      <FloatingCalculatorPanel />
      <FloatingCalculatorButton />
    </Box>
  );
}
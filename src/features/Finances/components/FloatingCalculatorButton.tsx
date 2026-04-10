import CalculateIcon from "@mui/icons-material/Calculate";
import { Fab } from "@mui/material";
import { useCalculator } from "../contexts/CalculatorContext";
import { financePalette } from "../styles";

export default function FloatingCalculatorButton() {
  const { toggleCalculator } = useCalculator();

  return (
    <Fab
      aria-label="Abrir calculadora"
      onClick={toggleCalculator}
      size="small"
      sx={{
        position: "fixed",
        bottom: 18,
        right: 18,
        zIndex: 1400,
        width: 48,
        height: 48,
        minHeight: 48,
        bgcolor: financePalette.primary,
        color: "#fff",
        '&:hover': {
          bgcolor: financePalette.primaryDark,
        },
      }}
    >
      <CalculateIcon fontSize="small" />
    </Fab>
  );
}

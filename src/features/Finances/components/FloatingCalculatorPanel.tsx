import CloseIcon from "@mui/icons-material/Close";
import { Box, Button, IconButton, Paper, TextField, Typography } from "@mui/material";
import { useState, type ChangeEvent, type KeyboardEvent } from "react";
import { useCalculator } from "../contexts/CalculatorContext";
import { financePalette, pagePanelCardSx } from "../styles";

const buttons = [
  ["7", "8", "9", "/"],
  ["4", "5", "6", "*"],
  ["1", "2", "3", "-"],
  ["0", ".", "%", "+"],
];

const evaluateExpression = (expression: string) => {
  let sanitized = expression.replace(/[^0-9.+\-*/()%]/g, "");
  
  // Add implicit multiplication between number and parentheses: 4( -> 4*(
  sanitized = sanitized.replace(/(\d)\(/g, "$1*(");
  
  // Add implicit multiplication between number and parentheses: )4 -> )*4
  sanitized = sanitized.replace(/\)(\d)/g, ")*$1");
  // Add implicit multiplication between parentheses: )( -> )*(
  sanitized = sanitized.replace(/\)\(/g, ")*(");
  
  // Convert % to /100: 5% -> 5/100, but not if followed by digit (for modulo)
  sanitized = sanitized.replace(/(\d+(?:\.\d+)?)%(?!\s*\d)/g, "($1/100)");

  try {
    // eslint-disable-next-line no-new-func
    const result = new Function(`"use strict"; return (${sanitized})`)();
    return String(result);
  } catch {
    return "Error";
  }
};

export default function FloatingCalculatorPanel() {
  const { open, closeCalculator } = useCalculator();
  const [display, setDisplay] = useState("0");
  const [memory, setMemory] = useState(0);
  const [memoryActive, setMemoryActive] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  const handleMemoryAdd = () => {
    const currentValue = parseFloat(display) || 0;
    setMemory((prev) => prev + currentValue);
    setMemoryActive(true);
  };

  const handleMemoryRecall = () => {
    setDisplay(String(memory));
    setMemoryActive(false);
  };

  const handleMemoryClear = () => {
    setMemory(0);
    setMemoryActive(false);
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  const handleClick = (value: string) => {
    if (value === "C") {
      setDisplay("0");
      return;
    }

    if (value === "=") {
      const result = evaluateExpression(display);
      setHistory((prev) => [...prev.slice(-4), `${display} = ${result}`]);
      setDisplay(result);
      return;
    }

    setDisplay((current) => {
      if (current === "0" && value !== ".") {
        return value;
      }
      return `${current}${value}`;
    });
  };

  const sanitizeInput = (value: string) => value.replace(/[^0-9.+\-*/%()]/g, "");

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;
    setDisplay(nextValue === "" ? "" : sanitizeInput(nextValue));
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      setDisplay((current) => evaluateExpression(current));
    }
  };

  if (!open) {
    return null;
  }

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 84,
        right: 18,
        zIndex: 1350,
        width: { xs: "calc(100vw - 36px)", sm: 280 },
      }}
    >
      <Paper elevation={10} sx={{ ...pagePanelCardSx, p: 1.5 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Typography variant="subtitle2" fontWeight={700}>
              Calculator
            </Typography>
            {memoryActive && (
              <Typography variant="caption" sx={{ bgcolor: financePalette.primary, color: "#fff", px: 0.8, py: 0.3, borderRadius: "4px", fontWeight: 700 }}>
                M
              </Typography>
            )}
          </Box>
          <IconButton size="small" onClick={closeCalculator} aria-label="Fechar calculadora">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <Box sx={{ display: "flex", gap: 0.5, mb: 1, justifyContent: "flex-end" }}>
          <Button
            size="small"
            onClick={handleMemoryAdd}
            sx={{
              minWidth: 0,
              px: 0.8,
              py: 0.3,
              fontSize: "0.7rem",
              borderRadius: "6px",
              textTransform: "none",
              color: financePalette.primary,
              borderColor: financePalette.primary,
              '&:hover': {
                bgcolor: "rgba(8, 168, 16, 0.08)",
              },
            }}
            variant="outlined"
          >
            M+
          </Button>
          <Button
            size="small"
            onClick={handleMemoryRecall}
            sx={{
              minWidth: 0,
              px: 0.8,
              py: 0.3,
              fontSize: "0.7rem",
              borderRadius: "6px",
              textTransform: "none",
              color: financePalette.primary,
              borderColor: financePalette.primary,
              '&:hover': {
                bgcolor: "rgba(8, 168, 16, 0.08)",
              },
            }}
            variant="outlined"
          >
            MR
          </Button>
          <Button
            size="small"
            onClick={handleMemoryClear}
            sx={{
              minWidth: 0,
              px: 0.8,
              py: 0.3,
              fontSize: "0.7rem",
              borderRadius: "6px",
              textTransform: "none",
              color: financePalette.primary,
              borderColor: financePalette.primary,
              '&:hover': {
                bgcolor: "rgba(8, 168, 16, 0.08)",
              },
            }}
            variant="outlined"
          >
            MC
          </Button>
          <Button
            size="small"
            onClick={handleClearHistory}
            sx={{
              minWidth: 0,
              px: 0.8,
              py: 0.3,
              fontSize: "0.7rem",
              borderRadius: "6px",
              textTransform: "none",
              color: financePalette.primary,
              borderColor: financePalette.primary,
              '&:hover': {
                bgcolor: "rgba(8, 168, 16, 0.08)",
              },
            }}
            variant="outlined"
          >
            CH
          </Button>
        </Box>

        <TextField
          value={display}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          variant="outlined"
          fullWidth
          size="small"
          autoComplete="off"
          inputProps={{
            sx: {
              textAlign: "right",
              fontSize: 18,
              px: 1,
            },
          }}
          sx={{
            mb: 1.5,
            bgcolor: financePalette.neutralSoft,
            borderRadius: 1,
            '& .MuiOutlinedInput-root': {
              borderRadius: 1,
              bgcolor: financePalette.neutralSoft,
            },
          }}
        />

        {history.length > 0 && (
          <Box sx={{ mb: 1, maxHeight: 80, overflowY: 'auto', bgcolor: financePalette.neutralSoft, p: 1, borderRadius: 1 }}>
            {history.map((calc, i) => (
              <Typography key={i} variant="caption" sx={{ display: 'block', fontSize: '0.7rem' }}>
                {calc}
              </Typography>
            ))}
          </Box>
        )}

        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 56px)", justifyContent: "center", gap: 1, width: "fit-content", mx: "auto" }}>
          {[
            { label: "C", action: () => setDisplay("0"), green: true },
            { label: "(", action: () => handleClick("("), green: true },
            { label: ")", action: () => handleClick(")"), green: true },
            {
              label: "DEL",
              action: () => setDisplay((prev) => (prev.length <= 1 ? "0" : prev.slice(0, -1))),
              green: true,
            },
          ].map((item) => (
            <Button
              key={item.label}
              sx={{
                minWidth: 0,
                width: 50,
                borderRadius: "10px",
                textTransform: "none",
                fontSize: "0.85rem",
                color: financePalette.primary,
                borderColor: financePalette.primary,
                '&:hover': {
                  bgcolor: "rgba(8, 168, 16, 0.08)",
                  borderColor: financePalette.primary,
                },
              }}
              variant="outlined"
              onClick={item.action}
            >
              {item.label}
            </Button>
          ))}

          {buttons.flat().map((button) => (
            <Button
              key={button}
              sx={{
                minWidth: 0,
                width: 50,
                borderRadius: "10px",
                textTransform: "none",
                fontSize: "0.85rem",
                color: button === "=" ? "#fff" : button === "/" ? "primary.main" : (button === "C" || button === "(" || button === ")") ? financePalette.primary : undefined,
                bgcolor: button === "=" ? financePalette.primary : "transparent",
                borderColor: financePalette.neutralBorder,
                '&:hover': {
                  bgcolor: button === "=" ? financePalette.primaryDark : button === "/" ? "rgba(8, 168, 16, 0.08)" : "rgba(61, 175, 66, 0.08)",
                  borderColor: financePalette.primary,
                },
              }}
              variant={button === "=" ? "contained" : "outlined"}
              onClick={() => handleClick(button)}
            >
              {button}
            </Button>
          ))}
        </Box>

        <Box sx={{ mt: 1 }}>
          <Button
            fullWidth
            sx={{
              bgcolor: financePalette.primary,
              color: "#fff",
              borderRadius: "10px",
              textTransform: "none",
              fontSize: "0.9rem",
              '&:hover': {
                bgcolor: financePalette.primaryDark,
              },
            }}
            onClick={() => handleClick("=")}
          >
            =
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
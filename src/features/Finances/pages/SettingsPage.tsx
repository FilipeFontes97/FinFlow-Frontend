import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
  Alert,
  FormControlLabel,
  Radio,
  RadioGroup
} from "@mui/material";

import { settingsService, type UserSettings } from "../services/settingsService";
import { financialProjectionService } from "../services/financialProjectionService";
import { modalPrimaryButtonSx } from "../components/modalStyles";
import { financePalette, pageHeaderSx, pagePanelCardSx } from "../styles";
import { isValidDecimalInput, parseLocaleDecimal } from "../utils/numberInput";

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
  backgroundColor: financePalette.neutralSoft,
  fontSize: "1.1rem",
  fontWeight: 600,
  whiteSpace: "nowrap",
};

const settingsCardSx = {
  ...pagePanelCardSx,
  p: 1.25,
  backgroundColor: "rgba(248, 250, 252, 0.63)",
  borderTop: `3px solid ${financePalette.primary}`,
  backdropFilter: "blur(2px)",
};

const inputSx = {
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#fff",
    color: "#111827",
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: financePalette.primary,
    },
    "& .MuiInputBase-input": {
      paddingTop: "10px",
      paddingBottom: "10px",
    },
  },
  "& .MuiFormHelperText-root": {
    color: "#111827",
  },
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings>({
    income: 0,
    name: "",
    fixedExpensesThresholdPercent: 33,
    emergencyFundTarget: 0,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [emergencyGoalMode, setEmergencyGoalMode] = useState<"amount" | "months">("amount");
  const [incomeInput, setIncomeInput] = useState("0");
  const [emergencyFundTargetInput, setEmergencyFundTargetInput] = useState("0");
  const [fixedExpensesThresholdInput, setFixedExpensesThresholdInput] = useState("33");
  const [emergencyFundMonthsInput, setEmergencyFundMonthsInput] = useState("6");
  const [monthlyExpenses, setMonthlyExpenses] = useState<number>(0);

  useEffect(() => {
    const load = async () => {
      try {
        const [data, projection] = await Promise.all([
          settingsService.get(),
          financialProjectionService.getEmergencyFundProjection(),
        ]);
        setSettings(data);
        setIncomeInput(String(data.income ?? 0));
        setEmergencyFundTargetInput(String(data.emergencyFundTarget ?? 0));
        setFixedExpensesThresholdInput(String(data.fixedExpensesThresholdPercent ?? 33));
        const monthlyExpensesValue = projection.monthlyExpenses ?? 0;
        setMonthlyExpenses(monthlyExpensesValue);

        if (monthlyExpensesValue > 0 && data.emergencyFundTarget > 0) {
          setEmergencyFundMonthsInput((data.emergencyFundTarget / monthlyExpensesValue).toFixed(1));
        }
      } catch {
        setError("Could not load settings.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  useEffect(() => {
    if (emergencyGoalMode !== "months") return;

    const monthsValue = Math.max(0, parseLocaleDecimal(emergencyFundMonthsInput));
    const calculatedTarget = Number((monthsValue * monthlyExpenses).toFixed(2));
    setSettings((prev) => {
      if (prev.emergencyFundTarget === calculatedTarget) return prev;
      return {
        ...prev,
        emergencyFundTarget: calculatedTarget,
      };
    });
    setEmergencyFundTargetInput(String(calculatedTarget));
  }, [emergencyGoalMode, emergencyFundMonthsInput, monthlyExpenses]);

  async function handleSave() {
    setSaving(true);
    setError("");
    setSuccess(false);

    try {
      const payload: UserSettings = {
        ...settings,
        income: parseLocaleDecimal(incomeInput),
        emergencyFundTarget: parseLocaleDecimal(emergencyFundTargetInput),
        fixedExpensesThresholdPercent: parseLocaleDecimal(fixedExpensesThresholdInput),
      };

      await settingsService.update(payload);
      setSettings(payload);
      setSuccess(true);
    } catch {
      setError("Could not save settings.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <Typography>Loading settings...</Typography>;
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={pageHeaderSx}>
        <Typography component="h1" sx={pageTitleSx}>
          Settings
        </Typography>

        <Box sx={summaryBoxSx}>
          Monthly Income: {settings.income.toLocaleString("pt-PT")} EUR
        </Box>
      </Box>

      <Stack spacing={1.25} maxWidth={350}>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">Settings saved.</Alert>}

        <Paper sx={settingsCardSx}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: 1.25,
            }}
          >
            <Box>
              <Typography variant="caption" sx={{ display: "block", mb: 0.4, fontWeight: 700, color: "#111827" }}>
                Name
              </Typography>
              <TextField
                fullWidth
                size="small"
                sx={inputSx}
                value={settings.name}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    name: e.target.value,
                  })
                }
              />
            </Box>

            <Box>
              <Typography variant="caption" sx={{ display: "block", mb: 0.4, fontWeight: 700, color: "#111827" }}>
                Monthly Income (€)
              </Typography>
              <TextField
                fullWidth
                size="small"
                type="text"
                inputMode="decimal"
                sx={inputSx}
                value={incomeInput}
                onChange={(e) => {
                  if (!isValidDecimalInput(e.target.value)) return;
                  setIncomeInput(e.target.value);
                }}
              />
            </Box>

            <Box>
              <Typography variant="caption" sx={{ display: "block", mb: 0.4, fontWeight: 700, color: "#111827" }}>
                Emergency Fund Goal
              </Typography>

              <RadioGroup
                value={emergencyGoalMode}
                onChange={(e) => setEmergencyGoalMode(e.target.value as "amount" | "months")}
                sx={{ mb: 0.7 }}
              >
                <FormControlLabel
                  value="amount"
                  control={<Radio size="small" />}
                  label="Set amount (EUR)"
                  sx={{ "& .MuiFormControlLabel-label": { color: "#111827", fontSize: "0.86rem" } }}
                />
                <FormControlLabel
                  value="months"
                  control={<Radio size="small" />}
                  label="Cover X months"
                  sx={{ "& .MuiFormControlLabel-label": { color: "#111827", fontSize: "0.86rem" } }}
                />
              </RadioGroup>

              {emergencyGoalMode === "amount" ? (
                <TextField
                  fullWidth
                  size="small"
                  type="text"
                  inputMode="decimal"
                  sx={inputSx}
                  value={emergencyFundTargetInput}
                  onChange={(e) => {
                    if (!isValidDecimalInput(e.target.value)) return;
                    setEmergencyFundTargetInput(e.target.value);
                    setSettings({
                      ...settings,
                      emergencyFundTarget: parseLocaleDecimal(e.target.value)
                    });
                  }}
                />
              ) : (
                <Stack spacing={0.75}>
                  <TextField
                    fullWidth
                    size="small"
                    type="text"
                    inputMode="decimal"
                    sx={inputSx}
                    label="Months"
                    value={emergencyFundMonthsInput}
                    onChange={(e) => {
                      if (!isValidDecimalInput(e.target.value)) return;
                      setEmergencyFundMonthsInput(e.target.value);
                    }}
                  />
                  <Typography variant="caption" sx={{ color: "#334155" }}>
                    Monthly fixed expenses: {monthlyExpenses.toLocaleString("pt-PT")} EUR
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#334155", fontWeight: 700 }}>
                    Calculated target: {parseLocaleDecimal(emergencyFundTargetInput).toLocaleString("pt-PT")} EUR
                  </Typography>
                </Stack>
              )}
            </Box>

            <Box>
              <Typography variant="caption" sx={{ display: "block", mb: 0.4, fontWeight: 700, color: "#111827" }}>
                Fixed Expenses Warning Threshold (%)
              </Typography>
              <TextField
                fullWidth
                size="small"
                type="text"
                inputMode="decimal"
                helperText="Recommended: 25-35%"
                sx={inputSx}
                value={fixedExpensesThresholdInput}
                onChange={(e) => {
                  if (!isValidDecimalInput(e.target.value)) return;
                  setFixedExpensesThresholdInput(e.target.value);
                }}
              />
            </Box>
          </Box>
        </Paper>

        <Box>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={saving}
            sx={modalPrimaryButtonSx}
          >
            {saving ? "Saving..." : "Save"}
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
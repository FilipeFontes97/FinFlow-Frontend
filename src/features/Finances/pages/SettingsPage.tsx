import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
  Alert
} from "@mui/material";

import { settingsService, type UserSettings } from "../services/settingsService";
import { modalPrimaryButtonSx } from "../components/modalStyles";
import { financePalette, pageHeaderSx, pagePanelCardSx } from "../styles";

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
  p: 0,
  overflow: "hidden",
};

const settingsCardHeaderSx = {
  px: 2,
  py: 1.2,
  backgroundColor: financePalette.primary,
  borderBottom: `1px solid ${financePalette.primaryDark}`,
};

const settingsCardBodySx = {
  p: 2,
  backgroundColor: financePalette.neutralSurface,
};

const inputSx = {
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#fff",
  },
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings>({
    income: 0,
    fixedExpensesThresholdPercent: 33
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await settingsService.get();
        setSettings(data);
      } catch {
        setError("Could not load settings.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  async function handleSave() {
    setSaving(true);
    setError("");
    setSuccess(false);

    try {
      await settingsService.update(settings);
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

      <Stack spacing={2} maxWidth={520}>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">Settings saved.</Alert>}

        <Paper sx={settingsCardSx}>
          <Box sx={settingsCardHeaderSx}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#ffffff" }}>
              Monthly Income (€)
            </Typography>
          </Box>

          <Box sx={settingsCardBodySx}>
            <TextField
              fullWidth
              type="number"
              inputProps={{ min: 0 }}
              sx={inputSx}
              value={settings.income}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  income: Number(e.target.value)
                })
              }
            />
          </Box>
        </Paper>

        <Paper sx={settingsCardSx}>
          <Box sx={settingsCardHeaderSx}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#ffffff" }}>
              Fixed Expenses Warning Threshold (%)
            </Typography>
          </Box>

          <Box sx={settingsCardBodySx}>
            <TextField
              fullWidth
              type="number"
              inputProps={{ min: 5, max: 80 }}
              helperText="Recommended: 25-35%"
              sx={inputSx}
              value={settings.fixedExpensesThresholdPercent}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  fixedExpensesThresholdPercent: Number(e.target.value)
                })
              }
            />
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
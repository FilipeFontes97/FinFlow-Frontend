import { Box, Stack, Typography, LinearProgress } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import DangerousOutlinedIcon from "@mui/icons-material/DangerousOutlined";
import { financePalette } from "../styles";

interface DashboardSignal {
  code: string;
  message: string;
  level: "Info" | "Warning" | "Danger";
}

interface Props {
  signals: DashboardSignal[];
  emergencyFundCurrent?: number;
  emergencyFundGoal?: number;
  monthsCovered?: number;
}

function money(value: number) {
  return value.toLocaleString("pt-PT", {
    style: "currency",
    currency: "EUR",
  });
}

export default function DashboardSignals({ signals, emergencyFundCurrent, emergencyFundGoal, monthsCovered }: Props) {
  if ((!signals || signals.length === 0) && !emergencyFundGoal) return null;

  const progress = emergencyFundGoal && emergencyFundGoal > 0 
    ? Math.min((emergencyFundCurrent || 0) / emergencyFundGoal * 100, 100)
    : 0;

  return (
    <Box
      sx={{
        mt: 2,
        display: "flex",
        gap: 3,
        justifyContent: "space-between",
        alignItems: "flex-start",
      }}
    >
      {/* Signals */}
      <Stack spacing={1} sx={{ flex: 1, maxWidth: "760px" }}>
      {signals.map(signal => {
        const styles = {
          Info: {
            border: "#cbd5e1",
            background: "#f8fafc",
            icon: <InfoOutlinedIcon fontSize="small" color="action" sx={{ mt: "2px" }} />
          },
          Warning: {
            border: "#fdba74",
            background: "#fff7ed",
            icon: <WarningAmberOutlinedIcon fontSize="small" sx={{ mt: "2px", color: "#ea580c" }} />
          },
          Danger: {
            border: "#fca5a5",
            background: "#fef2f2",
            icon: <DangerousOutlinedIcon fontSize="small" sx={{ mt: "2px", color: "#dc2626" }} />
          }
        }[signal.level];

        return (
          <Box
            key={signal.code}
            sx={{
              px: 1.25,
              py: 0.5,
              borderRadius: 1,
              border: "1px solid",
              borderColor: styles.border,
              backgroundColor: styles.background
            }}
          >
            <Stack direction="row" spacing={1} alignItems="flex-start">
              {styles.icon}

              <Typography variant="body2" color="text.primary">
                {signal.message}
              </Typography>
            </Stack>
          </Box>
        );
      })}
      </Stack>

      {/* Emergency Fund Goal Meter */}
      {emergencyFundGoal !== undefined && emergencyFundGoal > 0 && (
        <Box
          sx={{
            p: 1.5,
            borderRadius: "8px",
            border: `1px solid ${financePalette.neutralBorder}`,
            backgroundColor: financePalette.neutralSurface,
            minWidth: 200,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.75 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
              Emergency Fund
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 600, color: financePalette.primary }}>
              {progress.toFixed(0)}%
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={progress}
            sx={{
              mb: 0.75,
              height: 6,
              borderRadius: 3,
              backgroundColor: "#e2e8f0",
              "& .MuiLinearProgress-bar": {
                backgroundColor: financePalette.primary,
                borderRadius: 3,
              }
            }}
          />
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="caption" sx={{ color: "#64748b" }}>
              {money(emergencyFundCurrent || 0)}
            </Typography>
            <Typography variant="caption" sx={{ color: "#64748b" }}>
              {money(emergencyFundGoal)}
            </Typography>
          </Box>
          {monthsCovered !== undefined && (
            <Typography variant="caption" sx={{ mt: 0.65, display: "block", color: "#334155", fontWeight: 600 }}>
              Covers {monthsCovered.toFixed(1)} months
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
}

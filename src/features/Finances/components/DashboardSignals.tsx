import { Box, Stack, Typography } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import DangerousOutlinedIcon from "@mui/icons-material/DangerousOutlined";

interface DashboardSignal {
  code: string;
  message: string;
  level: "Info" | "Warning" | "Danger";
}

interface Props {
  signals: DashboardSignal[];
}

export default function DashboardSignals({ signals }: Props) {
  if (!signals || signals.length === 0) return null;

  return (
    <Stack spacing={1} sx={{ mt: 2 }}>
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
              py: 1,
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
  );
}

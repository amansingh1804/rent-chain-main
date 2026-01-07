import { Chip } from "@mui/material";
import {
  CheckCircle as AvailableIcon,
  Info as OccupiedIcon,
  Cancel as TerminatedIcon
} from "@mui/icons-material";

export default function StatusChip({ status }) {
  const getStatusConfig = (status) => {
    switch (status) {
      case "available":
        return {
          label: "Available",
          color: "success",
          icon: <AvailableIcon sx={{ fontSize: 16 }} />
        };
      case "occupied":
        return {
          label: "Occupied",
          color: "info",
          icon: <OccupiedIcon sx={{ fontSize: 16 }} />
        };
      case "terminated":
        return {
          label: "Terminated",
          color: "error",
          icon: <TerminatedIcon sx={{ fontSize: 16 }} />
        };
      default:
        return {
          label: "Unknown",
          color: "default",
          icon: null
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Chip
      label={config.label}
      color={config.color}
      icon={config.icon}
      size="small"
      variant="filled"
      sx={{
        fontWeight: 600,
        fontSize: '0.75rem',
        height: 24,
        '& .MuiChip-icon': {
          marginLeft: '6px',
        }
      }}
    />
  );
}

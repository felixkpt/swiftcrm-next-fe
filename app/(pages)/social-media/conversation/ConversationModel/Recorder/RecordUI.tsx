import { Box, Button, IconButton, Tooltip, Typography } from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import CancelIcon from "@mui/icons-material/Cancel";
import PauseIcon from "@mui/icons-material/Pause";

interface RecordUIProps {
  duration: number | null;
  stopRecording: () => void;
  abortRecording: () => void;
  pauseRecording: () => void;
  status: "recording" | "paused" | "idle";
}

const RecordUI: React.FC<RecordUIProps> = ({ duration, stopRecording, abortRecording, pauseRecording, status }) => {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" gap={2}>
      {/* Upload Button */}
      <Button
        variant="contained"
        color="primary"
        startIcon={<UploadIcon />}
        onClick={stopRecording}
      >
        Upload
      </Button>

      {/* Recording Duration with Blinking Indicator */}
      <Box display="flex" gap={1} justifyContent="center" alignItems="center">
        {status === "recording" && (
          <FiberManualRecordIcon
            color="error"
            style={{ animation: "blinker 1.5s linear infinite" }}
          />
        )}
        {duration !== null && (
          <Typography color="textPrimary" variant="body2">
            {duration} secs
          </Typography>
        )}
      </Box>

      {/* Pause Button with Tooltip */}
      {status === "recording" && false && (
        <Tooltip title="Pause">
          <IconButton onClick={pauseRecording} style={{ cursor: "pointer" }}>
            <PauseIcon style={{ color: "#FFC107" }} />
          </IconButton>
        </Tooltip>
      )}

      {/* Cancel Button with Tooltip */}
      <Tooltip title="Cancel">
        <IconButton onClick={abortRecording} style={{ cursor: "pointer" }}>
          <CancelIcon style={{ color: "#10B981" }} />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default RecordUI;

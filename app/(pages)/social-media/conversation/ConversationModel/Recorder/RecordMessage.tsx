import { useState, useRef, useCallback } from "react";
import { IconButton, Tooltip, CircularProgress } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import { ReactMediaRecorder } from "react-media-recorder";
import { pauseAllAudioElements } from "../helpers";
import RecordUI from "./RecordUI";
import { SvgIcon } from "@mui/material";

type Props = { handleStop: (blobUrl: string) => void, messagesMetadata: any, isLoading: boolean, uploadFailed: boolean, conversationsContainer: any };

const RecordMessage = ({ handleStop, messagesMetadata, isLoading, uploadFailed, conversationsContainer }: Props) => {
  const startTimeRef = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const stopButtonRef = useRef<() => void | null>(null);
  const pauseButtonRef = useRef<() => void | null>(null);
  const abortRef = useRef<boolean>(false);
  const [recording, setRecording] = useState(false);
  const [paused, setPaused] = useState(false);
  const [duration, setDuration] = useState<number | null>(null);
  const maxDuration = 60 * 3;

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setDuration((prevDuration) => (prevDuration ? prevDuration + 1 : 1));
      const elapsed = getDuration();
      if (stopButtonRef.current && elapsed && elapsed >= maxDuration) {
        stopButtonRef.current();
      }
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleStartRecording = () => {
    pauseAllAudioElements(conversationsContainer);
    startTimeRef.current = Date.now();
    setRecording(true);
    setPaused(false);
    setDuration(null);
    startTimer();
  };

  const [blobUrl, setBlobUrl] = useState<string>();

  const handleStopRecording = (blobUrl: string) => {
    setBlobUrl(blobUrl);
    setRecording(false);
    stopTimer();

    if (abortRef.current) {
      abortRef.current = false;
      return;
    }

    const durationInSeconds = getDuration();
    if (durationInSeconds) {
      setDuration(durationInSeconds);

      if (durationInSeconds < 3 || isNaN(durationInSeconds) || durationInSeconds > maxDuration) {
        return;
      }

      handleStop(blobUrl);
      startTimeRef.current = null;
      setDuration(null);
    }
  };

  const abortRecording = useCallback(() => {
    abortRef.current = true;
    if (stopButtonRef.current) {
      stopButtonRef.current();
    }
  }, []);

  const pauseRecording = useCallback(() => {
    if (pauseButtonRef.current) {
      pauseButtonRef.current();
      setPaused(true);
    }
  }, []);

  function getDuration() {
    const startTime = startTimeRef.current;
    if (startTime) {
      const durationInSeconds = Math.round((Date.now() - startTime) / 1000);
      return durationInSeconds;
    }
    return null;
  }

  return (
    <div className='h-full p-3 border-t text-center bg-gradient-to-r from-emerald-600 to-emerald-700'>
      {
        !messagesMetadata?.is_completed &&
        <ReactMediaRecorder
          audio
          onStop={handleStopRecording}
          stopStreamsOnStop
          render={({ status, startRecording, stopRecording, pauseRecording }) => {
            stopButtonRef.current = stopRecording;
            pauseButtonRef.current = pauseRecording;

            return (
              <div className="mt-2 mb-14">
                {
                  !isLoading ?
                    <>
                      {
                        !recording ?
                          <Tooltip title="Start recording">
                            <IconButton
                              onClick={() => {
                                startRecording();
                                handleStartRecording();
                              }}
                              color="inherit"
                            >
                              <MicIcon
                                color={status === 'recording' ? 'error' : 'action'}
                                sx={{ fontSize: 40 }}
                              />
                            </IconButton>
                          </Tooltip>
                          :
                          <RecordUI duration={duration} stopRecording={stopRecording} abortRecording={abortRecording} pauseRecording={pauseRecording} status={status} />
                      }

                      <div>
                        {
                          duration !== null && !recording &&
                          <div className="text-red-700 mt-2">
                            {duration < 3 && "Audio message is too short or invalid."}
                            {duration > maxDuration && "Audio message is too long."}
                          </div>
                        }
                      </div>
                      {!recording && uploadFailed ?
                        <div className="text-red-700 cursor-default flex justify-center items-center gap-1">
                          <Tooltip title="Click to retry uploading">
                            <span onClick={() => blobUrl && handleStop(blobUrl)}>
                              <span>Unknown error,</span>
                              <span className="cursor-pointer">
                                <SvgIcon>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                                </SvgIcon>
                              </span>
                            </span>
                          </Tooltip>
                        </div>
                        : null}
                    </>
                    :
                    <div className="flex justify-center items-center gap-2" role="status">
                      <Tooltip title="Uploading your recording...">
                        <CircularProgress size={56} />
                      </Tooltip>
                    </div>
                }
              </div>
            );
          }}
        />
      }
    </div>
  );
};

export default RecordMessage;

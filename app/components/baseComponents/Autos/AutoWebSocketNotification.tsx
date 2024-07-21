import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { WebSocketContext } from '@/app/context/WebSocketProvider';
import { useContext, useEffect, useState } from 'react';
import { Box, Grid } from '@mui/material';
import { publish } from '../utils/helpers';

interface ResponseType {
  model_id: string;
  message: string;
}

export default function AutoWebSocketNotification() {
  const data = useContext(WebSocketContext);

  const [response, setResponse] = useState<ResponseType | null>(null);

  useEffect(() => {
    if (data) {
      try {
        const resp: ResponseType = JSON.parse(data);
        console.log(resp);
        setResponse(resp);
      } catch (err) {
        console.error('Failed to parse WebSocket data:', err);
      }
    }
  }, [data]);

  useEffect(() => {
    if (response) {
      setOpen(true);
    }
  }, [response]);

  const [open, setOpen] = useState(false);

  const handleReload = () => {
    if (response) {
      const componentId = response.model_id + 'Component';
      publish(`${componentId}_done`, { message: 'Simulated _done event', status: 200 });
      setResponse(null);
    }

    setOpen(false);
  };

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <div>
      <Snackbar open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            p: 2,
          }}
        >
          {response && (
            <Alert
              onClose={() => {}}
              severity="success"
              variant="filled"
              sx={{
                width: 'auto',
                maxWidth: '400px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Grid container alignItems="center" justifyContent="center">
                <Grid item>
                  <span>{response.message}</span>
                </Grid>
                <Grid item>
                  <Button color="inherit" size="medium" sx={{ ml: 2 }} onClick={handleReload}>
                    Reload page
                  </Button>
                </Grid>
              </Grid>
            </Alert>
          )}
        </Box>
      </Snackbar>
    </div>
  );
}

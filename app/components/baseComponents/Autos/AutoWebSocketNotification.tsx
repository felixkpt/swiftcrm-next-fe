import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { WebSocketContext } from '@/app/context/WebSocketProvider';
import { useContext, useEffect, useState } from 'react';
import { Box, Grid } from '@mui/material';
import { publish } from '../utils/helpers';

export default function AutoWebSocketNotification() {
  const context = useContext(WebSocketContext);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (context?.response?.client_id && context?.response?.message) {
      setOpen(true);
    }
  }, [context?.response]);

  const handleReload = () => {
    if (context?.response?.model_id) {
      const componentId = context.response.model_id + 'Component';
      publish(`${componentId}_done`, { message: 'Simulated _done event', status: 200 });
    }
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Snackbar open={open}>
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
          {context?.response?.message && (
            <Alert
              onClose={handleClose}
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
                  <span>{context.response.message}</span>
                </Grid>
                <Grid item>
                  <Button type='button' color="inherit" size="medium" sx={{ ml: 2 }} onClick={handleReload}>
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

import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { WebSocketContext } from '@/app/context/WebSocketProvider';
import { useContext, useEffect, useState } from 'react';
import { Box, Grid } from '@mui/material';
import { publish } from '../utils/helpers';

export default function AutoWebSocketNotification() {
  const data = useContext(WebSocketContext);

  const [message, setMessage] = useState(null)

  useEffect(() => {
    if (data) {
      try {
        const parsed = JSON.parse(data)
        console.log(parsed)
        setMessage(parsed.message)
      } catch (err) { }
    }
  }, [data])

  useEffect(() => {
    if (message) {
      setOpen(true)
    }
  }, [message])

  const [open, setOpen] = useState(false);

  const handleReload = () => {
    console.log('ree')
    setOpen(false);
    publish('', {})

  };

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <div>
      <Snackbar open={open} onClose={handleClose} >
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
          {message && (
            <Alert
              onClose={() => { }}
              severity="success"
              variant="filled"
              sx={{
                width: 'auto',
                maxWidth: '400px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Grid container alignItems="center" justifyContent="center">
                <Grid item>
                  <span>{message}</span>
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

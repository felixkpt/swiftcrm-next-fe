import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useAppState } from '@/app/context/AppStateProvider';
import { useEffect, useState } from 'react';
import { Box, Grid, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { publish } from '../../utils/helpers';

export default function AutoWebSocketNotification() {
  const { events, client_id } = useAppState();
  const [open, setOpen] = useState(false);

  // useEffect(() => {
  //   if (response?.client_id && response?.message) {
  //     setOpen(true);
  //   }
  // }, [response]);

  // const handleReload = () => {
  //   if (response?.model_id) {
  //     const modelID = response.model_id;
  //     publish(`${modelID}_done`, { message: 'Simulated _done event', status: 200 });
  //   }
  //   setOpen(false);
  // };

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
          {/* {response?.message && (
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
                  <span>{response.message}</span>
                </Grid>
                <Grid item>
                  <Button type='button' color="inherit" size="medium" sx={{ ml: 2 }} onClick={handleReload}>
                    Reload page
                  </Button>
                </Grid>
              </Grid>
            </Alert>
          )} */}
        </Box>
      </Snackbar>
    </div>
  );
}

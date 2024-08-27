import React, { useState, useRef, useEffect } from 'react';
import { useAppState } from '@/app/context/AppStateProvider';
import { Box, Table, TableBody, TableCell, TableHead, TableRow, Typography, TableContainer, Paper, CircularProgress, IconButton } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import MenuIcon from '@mui/icons-material/Menu';

const renderStatusIcon = (status: 'pending' | 'done' | 'failed') => {
  switch (status) {
    case 'pending':
      return <CircularProgress size={24} />;
    case 'done':
      return <CheckCircleIcon color="success" />;
    case 'failed':
      return <ErrorIcon color="error" />;
    default:
      return null;
  }
};

const EventsTable: React.FC = () => {
  const { events, hasPendingEvents } = useAppState();
  const [open, setOpen] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);

  const toggleTable = () => {
    setOpen(!open);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (tableRef.current && !tableRef.current.contains(event.target as Node)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  return (
    <>
      <IconButton
        onClick={toggleTable}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          zIndex: 1200,
          backgroundColor: 'primary.main',
          color: 'white',
          ":hover": {
            backgroundColor: 'primary.dark',
          }
        }}
      >
        {
          !hasPendingEvents ?
            <MenuIcon />
            :
            <CircularProgress
              size={24}
              sx={{
                color: 'white',
                ":hover": { color: 'white' }
              }}
            />
        }
      </IconButton>

      {open && (
        <TableContainer
          ref={tableRef}
          component={Paper}
          sx={{
            position: 'fixed',
            bottom: 0,
            right: 0,
            width: {
              xs: '100%',
              sm: '100%',
              md: '50%',
            },
            maxHeight: 'calc(100vh - 60px)',
            overflow: 'auto',
            zIndex: 1200,
          }}
        >
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Events Status
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>UUID/Model ID</TableCell>
                  <TableCell>Event Name</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Data</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {events.map((event, index) => (
                  <TableRow key={index}>
                    <TableCell>{event.uuid}</TableCell>
                    <TableCell>{event.name}</TableCell>
                    <TableCell>{renderStatusIcon(event.status)}</TableCell>
                    <TableCell>{JSON.stringify(event.data)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </TableContainer>
      )}
    </>
  );
};

export default EventsTable;

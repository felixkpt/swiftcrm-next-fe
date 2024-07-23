import React from 'react';
import { useAppState } from '@/app/context/AppStateProvider';
import { Box, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';

const EventsTable: React.FC = () => {
  const { events } = useAppState();

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Events Status
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Event</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Data</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.entries(events).map(([event, { status, data }]) => (
            <TableRow key={event}>
              <TableCell>{event}</TableCell>
              <TableCell>{status}</TableCell>
              <TableCell>{JSON.stringify(data)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default EventsTable;

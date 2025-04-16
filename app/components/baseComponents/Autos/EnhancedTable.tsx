import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import { TablePagination } from '@mui/material';

type HeadCell = {
  id: string;
  numeric: boolean;
  disablePadding: boolean;
  label: string;
  width?: string;
};

type EnhancedTableProps = {
  modelID: string;
  headCells: HeadCell[];
  rows: any[];
  orderBy: string;
  order: 'asc' | 'desc';
  onRequestSort: (property: string) => void;
  onPageNumberChange: (page: number) => void;
  rowsPerPage: number;
  currentPage: number;
  totalRecords: number;
};

const EnhancedTable = ({
  modelID,
  headCells,
  rows,
  orderBy,
  order,
  onRequestSort,
  onPageNumberChange,
  rowsPerPage,
  currentPage,
  totalRecords
}: EnhancedTableProps) => {
  const handleRequestSort = (property: string) => {
    onRequestSort(property);
  };

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {headCells.map((headCell) => (
                <TableCell
                  key={headCell.id}
                  align={headCell.numeric ? 'right' : 'left'}
                  padding={headCell.disablePadding ? 'none' : 'normal'}
                  style={{ width: headCell.width || 'auto' }}
                >
                  <TableSortLabel
                    active={orderBy === headCell.id}
                    direction={orderBy === headCell.id ? order : 'asc'}
                    onClick={() => handleRequestSort(headCell.id)}
                  >
                    {headCell.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice().sort((a, b) => {
              const aVal = a[orderBy];
              const bVal = b[orderBy];
              if (aVal < bVal) return order === 'asc' ? -1 : 1;
              if (aVal > bVal) return order === 'asc' ? 1 : -1;
              return 0;
            }).map((row, index) => (
              <TableRow key={index}>
                {headCells.map((cell, i) => (
                  <TableCell key={cell.id} className={`${modelID} data-${cell.id}`} align={cell.numeric ? 'right' : 'left'}
                    style={{ width: cell.width || 'auto' }}
                  >
                    {row[cell.id]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={totalRecords}
        rowsPerPage={rowsPerPage}
        page={currentPage - 1}
        onPageChange={(event, newPage) => onPageNumberChange(newPage + 1)}
      />
    </Paper>
  );
};

export default EnhancedTable;

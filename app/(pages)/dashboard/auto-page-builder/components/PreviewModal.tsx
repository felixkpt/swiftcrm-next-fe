import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from '@mui/material';
import { ActionLabelType, FieldType } from '../types';


type Props = {
  open: boolean;
  onClose: () => void;
  modelName: string;
  apiEndpoint: string;
  fields: FieldType[];
  actionLabels: ActionLabelType[];
};

const PreviewModal: React.FC<Props> = ({ open, onClose, modelName, apiEndpoint, fields, actionLabels }) => {

  // Sample data for listed items and a single item preview
  const sampleDataList = [
    { id: 1, name: 'Sample Item 1', description: 'Description 1' },
    { id: 2, name: 'Sample Item 2', description: 'Description 2' },
  ];

  const sampleDataItem = { id: 1, name: 'Sample Item 1', description: 'Description 1' };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Preview Configuration</DialogTitle>
      <DialogContent>
        {/* Model/Page Name */}
        <Box mb={2}>
          <Typography variant="h6">Model/Page Name</Typography>
          <Typography>{modelName}</Typography>
        </Box>

        {/* API Endpoint */}
        <Box mb={2}>
          <Typography variant="h6">API Endpoint</Typography>
          <Typography>{apiEndpoint}</Typography>
        </Box>

        {/* Fillable Fields */}
        <Box mb={2}>
          <Typography variant="h6">Fillable Fields</Typography>
          {fields.map((field, index) => (
            <Typography key={index}>{`${field.name} (${field.type}) - ${field.label}`}</Typography>
          ))}
        </Box>

        {/* Headers */}
        <Box mb={2}>
          <Typography variant="h6">Headers</Typography>
          {fields.map((field, index) => (
            <Typography key={index}>{`${field.name} - ${field.label} (Visible in list: ${field.isVisibleInList ? 'Yes' : 'No'})`}</Typography>
          ))}
        </Box>

        {/* Action Labels */}
        <Box mb={2}>
          <Typography variant="h6">Action Labels</Typography>
          {actionLabels.map((label, index) => (
            <Typography key={index}>{`${label.key} - ${label.label} (Action: ${label.actionType}, Show: ${label.show ? 'Yes' : 'No'})`}</Typography>
          ))}
        </Box>

        {/* Listed Items */}
        <Box mb={2}>
          <Typography variant="h6">Listed Items</Typography>
          {sampleDataList.map((item) => (
            <Box key={item.id} mb={1}>
              <Typography variant="subtitle1">{item.name}</Typography>
              <Typography variant="body2">{item.description}</Typography>
            </Box>
          ))}
        </Box>

        {/* Single Item */}
        <Box mb={2}>
          <Typography variant="h6">Single Item</Typography>
          <Typography variant="subtitle1">{sampleDataItem.name}</Typography>
          <Typography variant="body2">{sampleDataItem.description}</Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PreviewModal;

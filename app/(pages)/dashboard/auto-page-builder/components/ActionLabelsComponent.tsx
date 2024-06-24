import React, { SetStateAction } from 'react';
import {
  TextField,
  IconButton,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Box,
  Button,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { ActionLabelType } from '../types';
import { actionLabelsActions } from '../utils/constants';

const actionTypes = ['navigation', 'modal'];

type ActionLabelsProps = {
  actionLabels: ActionLabelType[]
  setActionLabels: React.Dispatch<SetStateAction<ActionLabelType[]>>
  actionLabelValidations: boolean[]
  hasDoneSubmission: boolean
};

const ActionLabelsComponent: React.FC<ActionLabelsProps> = ({ actionLabels, setActionLabels, actionLabelValidations, hasDoneSubmission }) => {

  // Handler to update action label information
  const handleActionLabelChange = (index: number, label: ActionLabelType) => {
    setActionLabels((prevLabels) =>
      prevLabels.map((l, i) => (i === index ? label : l))
    );
  };

  // Handler to remove an action label by index
  const handleRemoveActionLabel = (index: number) => {
    setActionLabels((prevLabels) => prevLabels.filter((_, i) => i !== index));
  };


  // Handler to add a new action label
  const handleAddActionLabel = () => {
    if (actionLabels.length >= actionLabelsActions.length) return;

    setActionLabels([
      ...actionLabels,
      { key: '', label: '', actionType: '', show: true, required: true, isRequired: true },
    ]);
  };

  return (
    <>
      <Typography variant="subtitle1" gutterBottom>
        Action Labels
      </Typography>

      {
        actionLabels.map((label, index) => {

          const isValid = actionLabelValidations[index]
          const isInvalidField = (field: string) => {
            return hasDoneSubmission && actionLabelValidations[index] !== undefined && field === '' && !isValid;
          };

          return (
            <Box key={index}>
              <Grid container spacing={2} mt={2}>
                <Grid item xs={4}>
                  <FormControl fullWidth variant="outlined" error={isInvalidField(label.key)}>
                    <InputLabel id={`key-select-label-${index}`}>Key</InputLabel>
                    <Select
                      labelId={`key-select-label-${index}`}
                      id={`key-select-${index}`}
                      value={label.key}
                      onChange={(e) => handleActionLabelChange(index, { ...label, key: e.target.value })}
                      label="Key"
                    >
                      {actionLabelsActions.map((action) => (
                        <MenuItem key={action.key} value={action.key}>
                          {action.label}
                        </MenuItem>
                      ))}

                    </Select>
                    {isInvalidField(label.key) && <Typography color="error">This field is required</Typography>}
                  </FormControl>
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    label="Label"
                    fullWidth
                    variant="outlined"
                    value={label.label}
                    onChange={(e) => handleActionLabelChange(index, { ...label, label: e.target.value })}
                  />
                </Grid>
                <Grid item xs={3}>
                  <FormControl fullWidth variant="outlined" error={isInvalidField(label.actionType)}>
                    <InputLabel id={`action-type-select-label-${index}`}>Action Type</InputLabel>
                    <Select
                      labelId={`action-type-select-label-${index}`}
                      id={`action-type-select-${index}`}
                      value={label.actionType}
                      onChange={(e) => handleActionLabelChange(index, { ...label, actionType: e.target.value })}
                      label="Action Type"
                    >
                      {actionTypes.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </Select>
                    {isInvalidField(label.actionType) && <Typography color="error">This field is required</Typography>}
                  </FormControl>
                </Grid>
                <Grid item xs={1}>
                  <IconButton
                    aria-label="delete"
                    onClick={() => handleRemoveActionLabel(index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </Box>
          )
        }
        )

      }
      <Box mt={2}>
        <Button variant="outlined" onClick={handleAddActionLabel} disabled={actionLabels.length >= actionLabelsActions.length}>
          Add Action Label
        </Button>
      </Box>

    </>

  );
};

export default ActionLabelsComponent;

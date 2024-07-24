import React from 'react';
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
import { ActionLabelType, ActionLabelTypeValidation } from '../types';
import { actionLabelsActions, newActionLabel } from '../utils/constants';
import { makeActionLabelValidation } from '../utils/helpers';

const actionTypes = ['navigation', 'modal'];

type ActionLabelsProps = {
  actionLabels: ActionLabelType[];
  setActionLabels: React.Dispatch<React.SetStateAction<ActionLabelType[]>>;
  actionLabelValidations: ActionLabelTypeValidation[];
  updateActionLabelValidations: React.Dispatch<React.SetStateAction<ActionLabelTypeValidation[]>>;
  hasDoneSubmission: boolean;
};

const ActionLabelsComponent: React.FC<ActionLabelsProps> = ({
  actionLabels,
  setActionLabels,
  actionLabelValidations,
  updateActionLabelValidations,
  hasDoneSubmission,
}) => {
  // Handler to update action label information
  const handleActionLabelChange = (index: number, updatedLabel: ActionLabelType) => {
    const updatedLabels = [...actionLabels];
    updatedLabels[index] = updatedLabel;
    setActionLabels(updatedLabels);

    const updatedValidations = [...actionLabelValidations];
    updatedValidations[index] = makeActionLabelValidation(updatedLabel);
    updateActionLabelValidations(updatedValidations);
  };

  // Handler to remove an action label by index
  const handleRemoveActionLabel = (index: number) => {
    const updatedLabels = actionLabels.filter((_, i) => i !== index);
    setActionLabels(updatedLabels);

    const updatedValidations = actionLabelValidations.filter((_, i) => i !== index);
    updateActionLabelValidations(updatedValidations);
  };

  // Handler to add a new action label
  const handleAddActionLabel = () => {
    if (actionLabels.length >= actionLabelsActions.length) return;

    const updatedLabels = [...actionLabels, { ...newActionLabel }];
    setActionLabels(updatedLabels);

    const updatedValidations = [...actionLabelValidations, makeActionLabelValidation({ ...newActionLabel })];
    updateActionLabelValidations(updatedValidations);
  };

  // Function to check if a field is invalid
  const isInvalidField = (value: string, key: keyof ActionLabelType, validation: boolean | undefined) => {
    return hasDoneSubmission && newActionLabel[key].required && validation === false && value.trim() === '';
  };

  return (
    <>
      <Typography variant="subtitle1" gutterBottom>
        Record Action Labels
      </Typography>

      {actionLabels.map((label, index) => {
        const validation = actionLabelValidations[index];

        return (
          <Box key={index}>
            <Grid container spacing={2} mt={2}>
              <Grid item xs={4}>
                <FormControl
                  fullWidth
                  variant="outlined"
                  error={isInvalidField(label.key.value, 'key', validation?.key)}
                >
                  <InputLabel id={`key-select-label-${index}`}>Key</InputLabel>
                  <Select
                    labelId={`key-select-label-${index}`}
                    id={`key-select-${index}`}
                    value={label.key.value}
                    onChange={(e) =>
                      handleActionLabelChange(index, {
                        ...label,
                        key: { ...label.key, value: e.target.value },
                      })
                    }
                    label="Key"
                  >
                    {actionLabelsActions.map((action) => (
                      <MenuItem key={action.key} value={action.key}>
                        {action.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {isInvalidField(label.key.value, 'key', validation?.key) && (
                    <Typography color="error">This field is required</Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Label"
                  fullWidth
                  variant="outlined"
                  value={label.label.value}
                  onChange={(e) =>
                    handleActionLabelChange(index, {
                      ...label,
                      label: { ...label.label, value: e.target.value },
                    })
                  }
                  error={isInvalidField(label.label.value, 'label', validation?.label)}
                  helperText={
                    isInvalidField(label.label.value, 'label', validation?.label) &&
                    'This field is required'
                  }
                />
              </Grid>
              <Grid item xs={3}>
                <FormControl
                  fullWidth
                  variant="outlined"
                  error={isInvalidField(label.actionType.value, 'actionType', validation?.actionType)}
                >
                  <InputLabel id={`action-type-select-label-${index}`}>
                    Action Type
                  </InputLabel>
                  <Select
                    labelId={`action-type-select-label-${index}`}
                    id={`action-type-select-${index}`}
                    value={label.actionType.value}
                    onChange={(e) =>
                      handleActionLabelChange(index, {
                        ...label,
                        actionType: { ...label.actionType, value: e.target.value },
                      })
                    }
                    label="Action Type"
                  >
                    {actionTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                  {isInvalidField(label.actionType.value, 'actionType', validation?.actionType) && (
                    <Typography color="error">This field is required</Typography>
                  )}
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
        );
      })}

      <Box mt={2}>
        <Button
          variant="outlined"
          onClick={handleAddActionLabel}
          disabled={actionLabels.length >= actionLabelsActions.length}
        >
          Add Action Label
        </Button>
      </Box>
    </>
  );
};

export default ActionLabelsComponent;

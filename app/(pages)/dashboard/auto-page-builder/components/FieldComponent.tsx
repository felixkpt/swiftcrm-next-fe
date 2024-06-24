import React from 'react';
import {
  TextField,
  IconButton,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  Button,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { FieldType, FieldValidation } from '../types';
import Modal from './Modal';

type FieldProps = {
  inputTypes: { name: string, commonDataTypes: string[] }[];
  fields: FieldType[];
  setFields: React.Dispatch<React.SetStateAction<FieldType[]>>;
  fieldValidity: any[];
  hasDoneSubmission: boolean;
  onAddField: () => void;
  updateFieldValidation: (updatedField: FieldType) => FieldValidation;
  setFieldValidations: React.Dispatch<React.SetStateAction<FieldValidation[]>>
};

const FieldComponent: React.FC<FieldProps> = ({
  inputTypes,
  fields,
  setFields,
  fieldValidity,
  hasDoneSubmission,
  onAddField,
  updateFieldValidation,
  setFieldValidations,
}) => {

  const handleFieldChange = (index: number, updatedField: FieldType) => {
    if (updatedField.type.value === 'dropdown') {
      updatedField.dropdownSource.required = true;
    } else {
      updatedField.dropdownSource.required = false;
    }

    setFields((prevFields) =>
      prevFields.map((field, i) => (i === index ? updatedField : field))
    );

    const validation: FieldValidation = updateFieldValidation(updatedField);

    setFieldValidations((prevValidations) => {
      const newValidations = [...prevValidations];
      newValidations[index] = validation;
      return newValidations;
    });
  };

  const handleRemoveField = (index: number) => {
    setFields((prevFields) => prevFields.filter((_, i) => i !== index));
  };

  const handleTypeChange = (
    e: React.ChangeEvent<{ value: unknown }>,
    required: boolean,
    index: number
  ) => {
    handleFieldChange(index, {
      ...fields[index],
      type: { value: e.target.value as string, required },
    });
  };

  const renderTextField = (label: string, key: keyof FieldType, field: FieldType, index: number) => (
    <TextField
      label={label}
      fullWidth
      variant="outlined"
      value={field[key].value as string}
      onChange={(e) =>
        handleFieldChange(index, {
          ...field,
          [key]: {
            value: e.target.value,
            required: field[key].required,
          },
        })
      }
      error={
        hasDoneSubmission &&
        typeof fieldValidity[index][key] === 'boolean' &&
        !fieldValidity[index][key] &&
        field[key].required &&
        !(field[key].value && field[key].value.trim())
      }
      helperText={
        hasDoneSubmission &&
          typeof fieldValidity[index][key] === 'boolean' &&
          !fieldValidity[index][key] &&
          field[key].required &&
          !(field[key].value && field[key].value.trim())
          ? 'This field is required'
          : ''
      }
      sx={{
        borderColor:
          hasDoneSubmission &&
            !fieldValidity[index][key] &&
            field[key].required &&
            !(field[key].value && field[key].value.trim())
            ? 'red'
            : undefined,
      }}
    />
  );

  return (
    <Box mb={2}>
      <Typography variant="subtitle1" gutterBottom>
        Fillable Fields
      </Typography>
      {fields.map((field, index) => (
        <Grid container spacing={2} mt={2} key={index}>
          <Grid item xs={5}>
            {renderTextField('Name', 'name', field, index)}
          </Grid>
          <Grid item xs={5}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Type</InputLabel>
              <Select
                value={field.type.value}
                onChange={(e: any) => handleTypeChange(e, field.type.required, index)}
                label="Type"
                error={
                  hasDoneSubmission &&
                  typeof fieldValidity[index].type === 'boolean' &&
                  !fieldValidity[index].type &&
                  field.type.required &&
                  !field.type.value.trim()
                }
                sx={{
                  borderColor:
                    hasDoneSubmission &&
                      typeof fieldValidity[index].type === 'boolean' &&
                      !fieldValidity[index].type &&
                      field.type.required &&
                      !field.type.value.trim()
                      ? 'red'
                      : undefined,
                }}
              >
                {inputTypes.map((type, idx) => (
                  <MenuItem key={idx} value={type.name}>
                    {type.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={1}>
            <Modal
              inputType={field.type.value}
              commonDataTypes={inputTypes.find(type => type.name === field.type.value)?.commonDataTypes || []}
              field={field}
              index={index}
              fieldValidity={fieldValidity[index]}
              hasDoneSubmission={hasDoneSubmission}
              onChange={handleFieldChange}
            />
          </Grid>
          <Grid item xs={1}>
            <IconButton aria-label="delete" onClick={() => handleRemoveField(index)}>
              <DeleteIcon />
            </IconButton>
          </Grid>
        </Grid>
      ))}
      <Box mt={2}>
        <Button variant="outlined" onClick={onAddField}>
          Add Field
        </Button>
      </Box>
    </Box>
  );
};

export default FieldComponent;

import React, { useState } from 'react';
import { Grid, Box, Typography } from '@mui/material';
import { FieldType, FieldValidation } from '../../types';
import { InputType, RecordType } from '@/app/components/baseComponents/Autos/BaseAutoModel/types';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import SideNav from './SideNav';
import DraggableField from './DraggableField';

type FieldProps = {
  inputTypes: InputType[];
  fields: FieldType[];
  setFields: React.Dispatch<React.SetStateAction<FieldType[]>>;
  fieldValidations: any[];
  dropdownSourcesList: RecordType[];
  hasDoneSubmission: boolean;
  onAddField: (name: string, type: string, dataType: string) => void;
  updateFieldValidation: (updatedField: FieldType) => FieldValidation;
  setFieldValidations: React.Dispatch<React.SetStateAction<FieldValidation[]>>
};

const FieldsComponent: React.FC<FieldProps> = ({
  inputTypes,
  fields,
  setFields,
  fieldValidations,
  dropdownSourcesList,
  hasDoneSubmission,
  onAddField,
  updateFieldValidation,
  setFieldValidations,
}) => {

  const [selectedField, setSelectedField] = useState({ field: fields[0], index: 0 })

  const handleFieldChange = (index: number, updatedField: FieldType) => {

    // Ensure the dropdownSource required property is set correctly
    const newField = {
      ...updatedField,
      dropdownSource: {
        ...updatedField.dropdownSource,
        required: updatedField.type.value === 'dropdown'
      }
    };

    if (selectedField.index === index) {
      setSelectedField({ field: newField, index })
    }

    // Create a new copy of the fields array with the updated field
    const newFields = fields.map((field, i) => (i === index ? newField : field));

    setFields(newFields);

    const validation: FieldValidation = updateFieldValidation(newField);

    setFieldValidations((prevValidations) => {
      const newValidations = [...prevValidations];
      newValidations[index] = validation;
      return newValidations;
    });
  };

  const handleFieldClick = (index: number) => {
    setSelectedField({ field: fields[index], index });
  };

  const handleRemoveField = (index: number) => {
    setFields((prevFields) => prevFields.filter((_, i) => i !== index));
  };

  const moveField = (dragIndex: number, hoverIndex: number) => {
    const draggedField = fields[dragIndex];
    const updatedFields = [...fields];
    updatedFields.splice(dragIndex, 1);
    updatedFields.splice(hoverIndex, 0, draggedField);
    setFields(updatedFields);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Typography variant="subtitle1" gutterBottom>
        Form Fillable Fields
      </Typography>
      <Grid container spacing={2}>
        {/* Control panel on the left side */}
        <Grid item xs={12} md={2} p={1} overflow={'auto'}>
          <SideNav onAddField={onAddField} />
        </Grid>
        {/* Content area on the right side */}
        <Grid item xs={12} md={10} p={1}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(12, 1fr)',
              gap: 3,
            }}
          >
            {fields.map((field, index) => (
              <DraggableField
                key={index}
                field={field}
                index={index}
                selectedField={selectedField}
                onClick={() => handleFieldClick(index)}
                moveField={moveField}
                handleRemoveField={handleRemoveField}
                inputTypes={inputTypes}
                handleFieldChange={handleFieldChange}
                dropdownSourcesList={dropdownSourcesList}
                fieldValidations={fieldValidations}
                hasDoneSubmission={hasDoneSubmission}
              />
            ))}
          </Box>
        </Grid>
      </Grid>

    </DndProvider>
  );
};

export default FieldsComponent;

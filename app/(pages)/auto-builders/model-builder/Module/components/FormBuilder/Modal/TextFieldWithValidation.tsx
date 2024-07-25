import React from 'react';
import TextField from '@mui/material/TextField';
import { FieldType, FieldValidation } from '../../../types';

interface TextFieldWithValidationProps {
    label: string;
    field: FieldType;
    fieldKey: keyof FieldType;
    index: number;
    handleFieldChange: (index: number, updatedField: FieldType) => void;
    fieldValidation: FieldValidation;
    hasDoneSubmission: boolean;
}

const TextFieldWithValidation: React.FC<TextFieldWithValidationProps> = ({
    label,
    field,
    fieldKey,
    index,
    handleFieldChange,
    fieldValidation,
    hasDoneSubmission,
}) => {
    const isFieldValid = !(
        hasDoneSubmission &&
        typeof fieldValidation[fieldKey] === 'boolean' &&
        !fieldValidation[fieldKey] &&
        field[fieldKey].required &&
        !(field[fieldKey].value && field[fieldKey].value.trim())
    );

    return (
        <TextField
            label={label}
            fullWidth
            variant="outlined"
            value={field[fieldKey].value}
            onChange={(e) =>
                handleFieldChange(index, {
                    ...field,
                    [fieldKey]: { value: e.target.value, required: field[fieldKey].required },
                })
            }
            error={!isFieldValid}
            helperText={
                !isFieldValid ? `${label} is required` : ''
            }
            sx={{
                marginBottom:'1rem'
            }}
        />
    );
};

export default TextFieldWithValidation;

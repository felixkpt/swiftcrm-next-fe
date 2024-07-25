import React from 'react';
import { FormControlLabel, Checkbox, Grid } from '@mui/material';
import { FieldType } from '../../../types';

interface CheckboxGroupProps {
    field: FieldType;
    handleCheckboxChange: (key: keyof FieldType, value: boolean) => void;
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({ field, handleCheckboxChange }) => {
    return (
        <>
            <Grid item xs={6}>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={field.isRequired.value}
                            onChange={(e) => handleCheckboxChange('isRequired', e.target.checked)}
                        />
                    }
                    label="Is Required"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={field.isVisibleInList.value}
                            onChange={(e) => handleCheckboxChange('isVisibleInList', e.target.checked)}
                        />
                    }
                    label="Visible in List"
                />
            </Grid>
            <Grid item xs={6}>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={field.isVisibleInSingleView.value}
                            onChange={(e) =>
                                handleCheckboxChange('isVisibleInSingleView', e.target.checked)
                            }
                        />
                    }
                    label="Visible in Single View"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={field.isUnique.value}
                            onChange={(e) => handleCheckboxChange('isUnique', e.target.checked)}
                        />
                    }
                    label="Is Unique"
                />
            </Grid>
        </>
    );
};

export default CheckboxGroup;

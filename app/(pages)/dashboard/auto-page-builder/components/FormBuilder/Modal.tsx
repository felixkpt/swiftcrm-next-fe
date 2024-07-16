import Pluralize from 'pluralize';
import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import { FormControl, Grid, InputLabel, MenuItem, Select, Typography, SelectChangeEvent } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { FieldType, FieldValidation } from '../../types';
import { validateDefaultValue } from '../../utils/helpers';
import { CommonDataTypes, RecordType } from '@/app/components/baseComponents/Autos/BaseAutoModel/types';

interface ModalProps {
    inputType: string;
    commonDataTypes: CommonDataTypes[];
    field: FieldType;
    index: number;
    fieldValidation: FieldValidation
    handleFieldChange: (index: number, updatedField: FieldType) => void;
    dropdownSourcesList: RecordType[];
    hasDoneSubmission: boolean;
}

const Modal: React.FC<ModalProps> = ({
    inputType,
    commonDataTypes,
    field,
    index,
    fieldValidation,
    handleFieldChange,
    dropdownSourcesList,
    hasDoneSubmission,
}) => {
    // State to control dialog open/close
    const [open, setOpen] = useState(false);

    // State for dropdown source and dependencies
    const [dropdownSource, setDropdownSource] = useState<string>(field.dropdownSource?.value || '');
    const [dropdownDependencies, setDropdownDependencies] = useState<string[]>(field.dropdownDependsOn?.value || []);

    // State to track if any modal fields are invalid
    const [isAnyModalFieldsInvalid, setIsAnyModalFieldsInvalid] = useState(false);

    // Effect to check for errors on mount and when dependencies change
    useEffect(() => {
        const checkForErrors = () => {
            const errors = !fieldValidation ? [] : [
                !fieldValidation.label && field.label.required && !(field.label.value && field.label.value.trim()),
                !fieldValidation.dataType && field.dataType.required && !field.dataType.value.trim(),
                !fieldValidation.defaultValue && field.defaultValue.required && !(field.defaultValue.value && field.defaultValue.value.trim()) || !validateDefaultValue(field.dataType.value, field.defaultValue.value),
                inputType === 'dropdown' && !fieldValidation.dropdownSource && field.dropdownSource.required && !(field.dropdownSource.value && field.dropdownSource.value.trim()),
            ];
            setIsAnyModalFieldsInvalid(errors.some(error => error));
        };

        checkForErrors();
    }, [field, fieldValidation, inputType, hasDoneSubmission]);

    // Handle dialog open
    const handleClickOpen = () => {
        setOpen(true);
    };

    // Handle dialog close
    const handleClose = () => {
        setOpen(false);
    };

    // Handle checkbox change
    const handleCheckboxChange = (key: keyof FieldType, value: boolean) => {
        const updatedField = {
            ...field,
            [key]: { value, required: field[key].required },
        };
        handleFieldChange(index, updatedField);
    };

    // Handle dropdown source change
    const handleSourceChange = (event: SelectChangeEvent<string>) => {
        if (dropdownSourcesList) {
            const newSource = event.target.value;
            setDropdownSource(newSource);
            const found = dropdownSourcesList.find((item) => item.apiEndpoint == newSource);
            if (found) {
                const newName = Pluralize.singular(found.name_singular.toLowerCase().replace(/[^a-zA-Z0-9]/g, '_')) + '_id';
                const updatedField = {
                    ...field,
                    name: { value: newName, required: true },
                    dropdownSource: { value: newSource, required: field.dropdownSource?.required },
                };
                handleFieldChange(index, updatedField);
            }
        }
    };

    // Handle dropdown dependencies change
    const handleDependencyChange = (event: SelectChangeEvent<string[]>) => {
        const newDependencies = event.target.value as string[];
        setDropdownDependencies(newDependencies);
        const updatedField = {
            ...field,
            dropdownDependsOn: { value: newDependencies, required: field.dropdownDependsOn?.required },
        };
        handleFieldChange(index, updatedField);
    };

    // Check if field is valid
    const isValid = field.name.value.trim() !== '' && field.type.value.trim() !== '';

    // Check for dropdown source error
    const dropdownSourceError =
        hasDoneSubmission &&
        !fieldValidation.dropdownSource &&
        field.dropdownSource.required &&
        !(field.dropdownSource.value && field.dropdownSource.value.trim());

    return (
        <>
            <Button
                size="small"
                variant="outlined"
                onClick={handleClickOpen}
                disabled={!isValid}
                style={{
                    color: isValid && isAnyModalFieldsInvalid ? 'red' : 'inherit',
                    minWidth: '24px',
                    padding: '10px',
                    fontSize: '18px'
                }}
            >
                <MoreVertIcon style={{ fontSize: '16px' }} />
            </Button>
            <Dialog fullWidth={false} maxWidth={'sm'} open={open} onClose={handleClose}>
                <DialogTitle>More Properties for {field.name.value}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} mt={2}>
                        <Grid item xs={12}>
                            <TextField
                                label="Name"
                                fullWidth
                                variant="outlined"
                                value={field.name.value}
                                onChange={(e) =>
                                    handleFieldChange(index, {
                                        ...field,
                                        name: { value: e.target.value, required: field.name.required },
                                    })
                                }
                                error={
                                    hasDoneSubmission &&
                                    typeof fieldValidation.name === 'boolean' &&
                                    !fieldValidation.name &&
                                    field.name.required &&
                                    !(field.name.value && field.name.value.trim())
                                }
                                helperText={
                                    hasDoneSubmission &&
                                        typeof fieldValidation.name === 'boolean' &&
                                        !fieldValidation.name &&
                                        field.name.required &&
                                        !(field.name.value && field.name.value.trim())
                                        ? 'Name is required'
                                        : ''
                                }
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Label"
                                fullWidth
                                variant="outlined"
                                value={field.label.value}
                                onChange={(e) =>
                                    handleFieldChange(index, {
                                        ...field,
                                        label: { value: e.target.value, required: field.label.required },
                                    })
                                }
                                error={
                                    hasDoneSubmission &&
                                    typeof fieldValidation.label === 'boolean' &&
                                    !fieldValidation.label &&
                                    field.label.required &&
                                    !(field.label.value && field.label.value.trim())
                                }
                                helperText={
                                    hasDoneSubmission &&
                                        typeof fieldValidation.label === 'boolean' &&
                                        !fieldValidation.label &&
                                        field.label.required &&
                                        !(field.label.value && field.label.value.trim())
                                        ? 'Label is required'
                                        : ''
                                }
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel>Data Type</InputLabel>
                                <Select
                                    value={field.dataType.value}
                                    onChange={(e) =>
                                        handleFieldChange(index, {
                                            ...field,
                                            dataType: { value: e.target.value, required: field.dataType.required },
                                        })
                                    }
                                    label="Data Type"
                                    error={
                                        hasDoneSubmission &&
                                        typeof fieldValidation.dataType === 'boolean' &&
                                        !fieldValidation.dataType &&
                                        field.dataType.required &&
                                        !field.dataType.value.trim()
                                    }
                                    sx={{
                                        borderColor:
                                            hasDoneSubmission &&
                                                typeof fieldValidation.dataType === 'boolean' &&
                                                !fieldValidation.dataType &&
                                                field.dataType.required &&
                                                !field.dataType.value.trim()
                                                ? 'red'
                                                : undefined,
                                    }}
                                >
                                    {commonDataTypes.map((dataType, idx) => (
                                        <MenuItem key={idx} value={dataType}>
                                            {dataType}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Default Value"
                                fullWidth
                                variant="outlined"
                                value={field.defaultValue.value}
                                onChange={(e) =>
                                    handleFieldChange(index, {
                                        ...field,
                                        defaultValue: {
                                            value: e.target.value,
                                            required: field.defaultValue.required,
                                        },
                                    })
                                }
                                error={
                                    hasDoneSubmission &&
                                    typeof fieldValidation.defaultValue === 'boolean' &&
                                    !fieldValidation.defaultValue &&
                                    field.defaultValue.required &&
                                    !(field.defaultValue.value && field.defaultValue.value.trim()) ||
                                    !validateDefaultValue(field.dataType.value, field.defaultValue.value)
                                }
                                helperText={
                                    hasDoneSubmission &&
                                        typeof fieldValidation.defaultValue === 'boolean' &&
                                        !fieldValidation.defaultValue &&
                                        field.defaultValue.required &&
                                        !(field.defaultValue.value && field.defaultValue.value.trim()) ||
                                        !validateDefaultValue(field.dataType.value, field.defaultValue.value)
                                        ? 'Default value is invalid for the selected data type'
                                        : ''
                                }
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <InputLabel>Width</InputLabel>
                            <Select
                                label="Width"
                                name="width"
                                fullWidth
                                value={field.desktopWidth.value}
                                onChange={(e) =>
                                    handleFieldChange(index, {
                                        ...field,
                                        desktopWidth: { value: parseInt(e.target.value ?? 0), required: field.desktopWidth.required },
                                    })
                                }                            >
                                {[...Array(12).keys()].map((value) => (
                                    <MenuItem key={value + 1} value={value + 1}>
                                        {value + 1}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>
                        {inputType === 'dropdown' && (
                            <>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle1" gutterBottom>
                                        Data source
                                    </Typography>
                                    <FormControl fullWidth variant="outlined">
                                        <InputLabel>Source</InputLabel>
                                        <Select
                                            value={dropdownSource}
                                            onChange={handleSourceChange}
                                            label="Source"
                                            error={dropdownSourceError}
                                            renderValue={(selected) => selected}
                                        >
                                            {dropdownSourcesList.map((dep, idx) => (
                                                <MenuItem key={idx} value={dep.apiEndpoint}>
                                                    {dep.apiEndpoint}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {dropdownSourceError && (
                                            <Typography variant="caption" color="error">
                                                Data source is required
                                            </Typography>
                                        )}
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle1" gutterBottom>
                                        Depends On
                                    </Typography>
                                    <FormControl fullWidth variant="outlined">
                                        <InputLabel>Dependencies</InputLabel>
                                        <Select
                                            multiple
                                            value={dropdownDependencies}
                                            onChange={handleDependencyChange}
                                            label="Dependencies"
                                            renderValue={(selected) => (selected as string[]).join(', ')}
                                        >
                                            {dropdownSourcesList.filter((itm) => itm !== dropdownSource.apiEndpoint).map((dep, idx) => (
                                                <MenuItem key={idx} value={dep.apiEndpoint}>
                                                    {dep.apiEndpoint}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </>
                        )}
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
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Modal;

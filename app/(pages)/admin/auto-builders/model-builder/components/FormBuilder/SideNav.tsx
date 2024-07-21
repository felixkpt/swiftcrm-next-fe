import React, { useState } from 'react';
import { Button, Grid, Modal, Box, TextField, Typography } from '@mui/material';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import DateRangeIcon from '@mui/icons-material/DateRange';
import DescriptionIcon from '@mui/icons-material/Description';
import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle';
import ImageIcon from '@mui/icons-material/Image';

type Props = {
    onAddField: (type: string, fieldType: string, name: string) => void;
};

const SideNav = ({ onAddField }: Props) => {
    const [open, setOpen] = useState(false);
    const [fieldType, setFieldType] = useState<{ type: string, fieldType: string } | null>(null);
    const [fieldName, setFieldName] = useState('');
    const [fieldNameError, setFieldNameError] = useState(false);

    const handleOpen = (type: string, fieldType: string) => {
        setFieldType({ type, fieldType });
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setFieldType(null);
        setFieldName('');
        setFieldNameError(false);
    };

    const handleAddField = () => {
        if (fieldName.trim() === '') {
            setFieldNameError(true);
            return;
        }
        if (fieldType) {
            onAddField(fieldName, fieldType.type, fieldType.fieldType);
            handleClose();
        }
    };

    return (
        <div>
            <Typography>Add a field</Typography>
            <Grid container mt={2} gap={1} justifyContent={'space-between'}>
                <Grid xs={'auto'} md={12}>
                    <Button
                        variant="outlined"
                        fullWidth
                        onClick={() => handleOpen('input', 'string')}
                        startIcon={<TextFieldsIcon />}
                        sx={{ mb: 2, display: 'flex', justifyContent: 'start' }}
                    >
                        Single Text
                    </Button>
                </Grid>
                <Grid xs={'auto'} md={12}>
                    <Button
                        variant="outlined"
                        fullWidth
                        onClick={() => handleOpen('input', 'date')}
                        startIcon={<DateRangeIcon />}
                        sx={{ mb: 2, display: 'flex', justifyContent: 'start' }}
                    >
                        Date
                    </Button>
                </Grid>
                <Grid xs={'auto'} md={12}>
                    <Button
                        variant="outlined"
                        fullWidth
                        onClick={() => handleOpen('textarea', 'text')}
                        startIcon={<DescriptionIcon />}
                        sx={{ mb: 2, display: 'flex', justifyContent: 'start' }}
                    >
                        Textarea
                    </Button>
                </Grid>
                <Grid xs={'auto'} md={12}>
                    <Button
                        variant="outlined"
                        fullWidth
                        onClick={() => handleOpen('dropdown', 'integer')}
                        startIcon={<ArrowDropDownCircleIcon />}
                        sx={{ mb: 2, display: 'flex', justifyContent: 'start' }}
                    >
                        Dropdown
                    </Button>
                </Grid>
                <Grid xs={'auto'} md={12}>
                    <Button
                        variant="outlined"
                        fullWidth
                        onClick={() => handleOpen('input', 'image')}
                        startIcon={<ImageIcon />}
                        sx={{ mb: 2, display: 'flex', justifyContent: 'start' }}
                    >
                        Image
                    </Button>
                </Grid>
            </Grid>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="field-name-modal-title"
                aria-describedby="field-name-modal-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 300,
                        bgcolor: 'background.paper',
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <h2 id="field-name-modal-title">
                        Enter Name for the {fieldType?.type}
                    </h2>
                    <TextField
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        label="Field Name"
                        value={fieldName}
                        onChange={(e) => {
                            setFieldName(e.target.value);
                            if (e.target.value.trim() !== '') setFieldNameError(false);
                        }}
                        error={fieldNameError}
                        helperText={fieldNameError ? 'Field name is required' : ''}
                    />
                    <Button variant="contained" onClick={handleAddField} sx={{ mt: 2 }}>
                        Add Field
                    </Button>
                </Box>
            </Modal>
        </div>
    );
};

export default SideNav;

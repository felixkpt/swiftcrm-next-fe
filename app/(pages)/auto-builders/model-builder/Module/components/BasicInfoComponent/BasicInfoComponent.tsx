import React, { useState, useEffect } from 'react';
import {
    TextField,
    Checkbox,
    FormControlLabel,
    Grid,
    Typography,
    InputAdornment,
    IconButton,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import AdvancedSettingsModal from './AdvancedSettingsModal';

type Props = {
    modelDisplayName: string;
    setModelDisplayName: React.Dispatch<React.SetStateAction<string>>;
    modelURI: string;
    setModelURI: React.Dispatch<React.SetStateAction<string>>;
    apiEndpoint: string;
    setApiEndpoint: React.Dispatch<React.SetStateAction<string>>;
    isValid: boolean;
    hasDoneSubmission: boolean;
    createFrontendViews: boolean;
    setCreateFrontendViews: React.Dispatch<React.SetStateAction<boolean>>;
    showAdvancedModal: boolean; 
    setShowAdvancedModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const BasicInfoComponent: React.FC<Props> = ({
    modelDisplayName,
    setModelDisplayName,
    modelURI,
    setModelURI,
    apiEndpoint,
    setApiEndpoint,
    isValid,
    hasDoneSubmission,
    createFrontendViews,
    setCreateFrontendViews,
    showAdvancedModal, 
    setShowAdvancedModal,
}) => {

    const isInvalidField = (field: string): boolean => {
        switch (field) {
            case 'modelDisplayName':
                return hasDoneSubmission && (
                    !isValid ||
                    modelDisplayName.trim() === '' ||
                    /[\/\s]/.test(modelDisplayName) ||
                    /^\d+$/.test(modelDisplayName) ||
                    /^\d/.test(modelDisplayName)
                );
            case 'modelURI':
                return hasDoneSubmission && (!isValid || modelURI.trim() === '');
            case 'apiEndpoint':
                return hasDoneSubmission && (!isValid || apiEndpoint.trim() === '');
            default:
                return true;
        }
    };

    const getHelperText = (field: string): string => {
        switch (field) {
            case 'modelDisplayName':
                if (modelDisplayName.trim() === '') {
                    return 'The field is required';
                } else if (/[\/\s]/.test(modelDisplayName)) {
                    return 'Model name should not contain slashes or spaces';
                } else if (/^\d+$/.test(modelDisplayName)) {
                    return 'Model name should not be numbers only';
                } else if (/^\d/.test(modelDisplayName)) {
                    return 'Model name should not start with a number';
                }
                break;
            case 'modelURI':
                return modelURI.trim() === '' ? 'The field is required' : '';
            case 'apiEndpoint':
                return apiEndpoint.trim() === '' ? 'The field is required' : '';
            default:
                return '';
        }
        return '';
    };

    const handleCheckboxChange = (checked: boolean) => {
        setCreateFrontendViews(checked);
    };
    
    return (
        <div>
            <TextField
                label="Model/Page Name"
                fullWidth
                variant="outlined"
                value={modelDisplayName}
                onChange={(e) => setModelDisplayName(e.target.value)}
                error={isInvalidField('modelDisplayName')}
                helperText={getHelperText('modelDisplayName')}
                sx={{ mb: 1 }}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton onClick={() => setShowAdvancedModal(true)} edge="end">
                                <SettingsIcon />
                            </IconButton>
                        </InputAdornment>
                    )
                }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, ml: 0.5 }}>
                Use a plural name (e.g., <i>Products</i>, <i>Users</i>). This will define the model and route naming.
            </Typography>

            <Grid item xs={6}>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={createFrontendViews}
                            onChange={(e) => handleCheckboxChange(e.target.checked)}
                        />
                    }
                    label="Create Frontend views"
                />
            </Grid>

            <AdvancedSettingsModal
                open={showAdvancedModal}
                onClose={() => setShowAdvancedModal(false)}
                modelURI={modelURI}
                setModelURI={setModelURI}
                apiEndpoint={apiEndpoint}
                setApiEndpoint={setApiEndpoint}
            />
        </div>
    );
};

export default BasicInfoComponent;

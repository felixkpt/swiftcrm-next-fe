import React, { useState } from 'react';
import { TextField, Checkbox, FormControlLabel, Grid } from '@mui/material';

type Props = {
    modelDisplayName: string;
    setModelDisplayName: React.Dispatch<React.SetStateAction<string>>;
    modelURI: string;
    setModelURI: React.Dispatch<React.SetStateAction<string>>;
    apiEndpoint: string;
    setApiEndpoint: React.Dispatch<React.SetStateAction<string>>;
    isValid: boolean; // Validation state
    hasDoneSubmission: boolean;
    createFrontendViews: boolean; // New state for checkbox
    setCreateFrontendViews: React.Dispatch<React.SetStateAction<boolean>>;
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
    setCreateFrontendViews
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
                sx={{
                    mb: 2,
                }}
            />
            <TextField
                label="Model/Page URI"
                fullWidth
                variant="outlined"
                value={modelURI}
                onChange={(e) => setModelURI(e.target.value)}
                error={isInvalidField('modelURI')}
                helperText={getHelperText('modelURI')}
                sx={{
                    mb: 2,
                }}
            />
            <TextField
                label="API Endpoint"
                fullWidth
                variant="outlined"
                value={apiEndpoint}
                onChange={(e) => setApiEndpoint(e.target.value)}
                error={isInvalidField('apiEndpoint')}
                helperText={getHelperText('apiEndpoint')}
                sx={{
                    mb: 2,
                }}
            />
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
        </div>
    );
};

export default BasicInfoComponent;

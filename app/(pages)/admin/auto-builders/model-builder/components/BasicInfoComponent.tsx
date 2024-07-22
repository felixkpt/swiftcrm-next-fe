import React from 'react';
import { TextField } from '@mui/material';

type Props = {
    modelDisplayName: string;
    setModelDisplayName: React.Dispatch<React.SetStateAction<string>>;
    modelURI: string;
    setModelURI: React.Dispatch<React.SetStateAction<string>>;
    apiEndpoint: string;
    setApiEndpoint: React.Dispatch<React.SetStateAction<string>>;
    isValid: boolean; // Validation state
    hasDoneSubmission: boolean;
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
                return true; // Default to true if field name is not recognized
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
                    borderColor: isInvalidField('modelDisplayName') ? 'red' : undefined
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
                    borderColor: isInvalidField('modelURI') ? 'red' : undefined
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
                    borderColor: isInvalidField('apiEndpoint') ? 'red' : undefined
                }}
            />
        </div>
    );
};

export default BasicInfoComponent;

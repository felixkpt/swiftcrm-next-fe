import React from 'react';
import { TextField } from '@mui/material';

type Props = {
    modelNameSingular: string;
    setModelNameSingular: React.Dispatch<React.SetStateAction<string>>;
    modelURI: string;
    setModelURI: React.Dispatch<React.SetStateAction<string>>;
    apiEndpoint: string;
    setApiEndpoint: React.Dispatch<React.SetStateAction<string>>;
    isValid: boolean; // Validation state
    hasDoneSubmission: boolean;
};

const BasicInfoComponent: React.FC<Props> = ({
    modelNameSingular,
    setModelNameSingular,
    modelURI,
    setModelURI,
    apiEndpoint,
    setApiEndpoint,
    isValid,
    hasDoneSubmission,
}) => {

    const isInvalidField = (field: string): boolean => {
        switch (field) {
            case 'modelNameSingular':
                return hasDoneSubmission && (
                    !isValid ||
                    modelNameSingular.trim() === '' ||
                    /[\/\s]/.test(modelNameSingular) ||
                    /^\d+$/.test(modelNameSingular) ||
                    /^\d/.test(modelNameSingular)
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
            case 'modelNameSingular':
                if (modelNameSingular.trim() === '') {
                    return 'The field is required';
                } else if (/[\/\s]/.test(modelNameSingular)) {
                    return 'Model name should not contain slashes or spaces';
                } else if (/^\d+$/.test(modelNameSingular)) {
                    return 'Model name should not be numbers only';
                } else if (/^\d/.test(modelNameSingular)) {
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
                value={modelNameSingular}
                onChange={(e) => setModelNameSingular(e.target.value)}
                error={isInvalidField('modelNameSingular')}
                helperText={getHelperText('modelNameSingular')}
                sx={{
                    mb: 2,
                    borderColor: isInvalidField('modelNameSingular') ? 'red' : undefined
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

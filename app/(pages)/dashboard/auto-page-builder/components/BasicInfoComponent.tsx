import React from 'react';
import { TextField } from '@mui/material';

type Props = {
    modelNameSingular: string;
    setModelName: React.Dispatch<React.SetStateAction<string>>;
    modelURI: string;
    setModelURI: React.Dispatch<React.SetStateAction<string>>;
    apiEndpoint: string;
    setApiEndpoint: React.Dispatch<React.SetStateAction<string>>;
    isValid: boolean; // Validation state
    hasDoneSubmission: boolean;
};

const BasicInfoComponent: React.FC<Props> = ({
    modelNameSingular,
    setModelName,
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
                return hasDoneSubmission && !isValid && modelNameSingular.trim() == '';
            case 'modelURI':
                return hasDoneSubmission && !isValid && modelURI.trim() == '';
            case 'apiEndpoint':
                return hasDoneSubmission && !isValid && apiEndpoint.trim() == '';
            default:
                return true; // Default to true if field name is not recognized
        }
    };

    return (
        <div>
            <TextField
                label="Model/Page Name"
                fullWidth
                variant="outlined"
                value={modelNameSingular}
                onChange={(e) => setModelName(e.target.value)}
                error={isInvalidField('modelNameSingular')}
                helperText={isInvalidField('modelNameSingular') ? 'The field is required' : ''}
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
                helperText={isInvalidField('modelURI') ? 'The field is required' : ''}
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
                helperText={isInvalidField('apiEndpoint') ? 'The field is required' : ''}
                sx={{
                    mb: 2,
                    borderColor: isInvalidField('apiEndpoint') ? 'red' : undefined
                }}
            />
        </div>
    );
};

export default BasicInfoComponent;

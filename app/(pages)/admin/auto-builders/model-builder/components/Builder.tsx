'use client';

import React, { useEffect, useState } from 'react';
import {
    Button,
    Typography,
    Grid,
    Box,
    Paper,
    Divider,
} from '@mui/material';
import BasicInfoComponent from './BasicInfoComponent';
import FieldsComponent from './FormBuilder/FieldsComponent';
import PreviewModal from './PreviewModal';
import { appConfig } from '@/app/components/baseComponents/utils/helpers';
import { ActionLabelTypeValidation, FieldValidation } from '../types';
import useFieldState from '../hooks/useFieldState';
import ActionLabelsComponent from './ActionLabelsComponent';
import { useParams } from 'next/navigation';
import axios from 'axios';
import getConstants from '../AutoModel/getConstants';
import { mapExistingFields, mapExistingActionLables, makeFieldValidation, makeActionLabelValidation } from '../utils/helpers';
import useActionLabelState from '../hooks/useActionLabelState';
import { InputType, RecordType } from '@/app/components/baseComponents/Autos/BaseAutoModel/types';
import RelationshipComponent from './RelationshipComponent';
import { publish } from '@/app/components/baseComponents/utils/pubSub';

type Props = {
    inputTypes: InputType[];
    dropdownSourcesList: RecordType[];
    saveAndGenerateModel: (data: any) => void;
};

const Builder: React.FC<Props> = ({ inputTypes, dropdownSourcesList, saveAndGenerateModel }) => {
    const params = useParams();
    const { API_ENDPOINT } = getConstants;
    const pageId = params?.['model-builder'];

    const [modelDisplayName, setModelDisplayName] = useState<string>('');
    const [modelURI, setModelURI] = useState<string>('');
    const [apiEndpoint, setApiEndpoint] = useState<string>('');
    const [createFrontendViews, setCreateFrontendViews] = useState<boolean>(false); // New state

    const { fields, setFields, fieldValidations, setFieldValidations, handleAddField } = useFieldState();
    const { actionLabels, setActionLabels, actionLabelValidations, setActionLabelValidations } = useActionLabelState();

    const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
    const [hasDoneSubmission, setHasDoneSubmission] = useState<boolean>(false);
    const [isBasicInfoValid, setIsBasicInfoValid] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(appConfig.api.url(`${API_ENDPOINT}${pageId}`));
                const data = response.data;
                setModelDisplayName(data.modelDisplayName);
                setModelURI(data.modelURI);
                setApiEndpoint(data.apiEndpoint);

                const mappedActionLabels = mapExistingActionLables(data.action_labels);
                setActionLabels(mappedActionLabels);

                const initialActionLabelValidations = mappedActionLabels.map(label =>
                    makeActionLabelValidation(label)
                );
                setActionLabelValidations(initialActionLabelValidations);

                const mappedFields = mapExistingFields(data.fields);
                setFields(mappedFields);

                const initialFieldValidations = mappedFields.map(field =>
                    makeFieldValidation(field)
                );
                setFieldValidations(initialFieldValidations);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        if (pageId) {
            fetchData();
        }

    }, [API_ENDPOINT, pageId, setFields]);

    const handlePreviewOpen = () => {
        setIsPreviewOpen(true);
    };

    const handlePreviewClose = () => {
        setIsPreviewOpen(false);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setHasDoneSubmission(true);

        const isModelNameValid = modelDisplayName.trim() !== '';
        const isModelURIValid = modelURI.trim() !== '';
        const isApiEndpointValid = apiEndpoint.trim() !== '';
        setIsBasicInfoValid(isModelNameValid && isModelURIValid && isApiEndpointValid);

        const fieldValidations: FieldValidation[] = fields.map(field =>
            makeFieldValidation(field)
        );
        setFieldValidations(fieldValidations);

        const actionLabelValidations: ActionLabelTypeValidation[] = actionLabels.map(label =>
            makeActionLabelValidation(label)
        );
        setActionLabelValidations(actionLabelValidations);

        const actionsValid = !createFrontendViews || actionLabelValidations.every(validation => Object.values(validation).every(Boolean))

        const isValid = isModelNameValid && isModelURIValid && isApiEndpointValid
            && fieldValidations.every(validation => Object.values(validation).every(Boolean))
            && actionsValid;

        if (!isValid) {
            publish('autoNotification', { error: { message: 'Please fill in all required fields.' }, type: 'error' });
            return;
        }

        try {
            await saveAndGenerateModel({
                modelDisplayName,
                modelURI,
                apiEndpoint,
                fields,
                actionLabels,
                pageId,
                createFrontendViews,
            });

            publish('autoNotification', { message: 'Model saved successfully.', type: 'success' });

        } catch (error) {
            console.error('Error saving model:', error);
            publish('autoNotification', { error: { message: 'Failed to save model.' }, type: 'error' });
        }
    };

    const [relationships, setRelationships] = useState<any[]>([]);

    return (
        <div>
            <div>
                <h1>Form Builder</h1>
            </div>
            <Grid justifyContent="center" mt={4}>
                <Grid item xs={10}>
                    <Paper elevation={3} sx={{ padding: 3 }}>
                        <Typography variant="h5" gutterBottom>
                            Auto Page Builder
                        </Typography>
                        <form onSubmit={handleSubmit}>
                            <BasicInfoComponent
                                modelDisplayName={modelDisplayName}
                                setModelDisplayName={setModelDisplayName}
                                modelURI={modelURI}
                                setModelURI={setModelURI}
                                apiEndpoint={apiEndpoint}
                                setApiEndpoint={setApiEndpoint}
                                isValid={isBasicInfoValid}
                                hasDoneSubmission={hasDoneSubmission}
                                createFrontendViews={createFrontendViews}
                                setCreateFrontendViews={setCreateFrontendViews}
                            />
                            <Divider sx={{ my: 2 }} />
                            <FieldsComponent
                                inputTypes={inputTypes}
                                fields={fields}
                                setFields={setFields}
                                dropdownSourcesList={dropdownSourcesList}
                                hasDoneSubmission={hasDoneSubmission}
                                updateFieldValidation={makeFieldValidation}
                                fieldValidations={fieldValidations}
                                setFieldValidations={setFieldValidations}
                                onAddField={handleAddField}
                            />
                            {
                                createFrontendViews &&
                                <>
                                    <Divider sx={{ my: 2 }} />
                                    <Box mb={2}>
                                        <ActionLabelsComponent
                                            actionLabels={actionLabels}
                                            setActionLabels={setActionLabels}
                                            hasDoneSubmission={hasDoneSubmission}
                                            updateActionLabelValidations={setActionLabelValidations}
                                            actionLabelValidations={actionLabelValidations}
                                        />
                                    </Box>
                                </>
                            }
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="h6" gutterBottom>
                                Define Relationships
                            </Typography>
                            <RelationshipComponent
                                relationships={relationships}
                                setRelationships={setRelationships}
                                autobuilderObjects={dropdownSourcesList}
                            />
                            <Divider sx={{ my: 2 }} />
                            <Box mt={2}>
                                <Button type="button" variant="contained" color="primary" onClick={handlePreviewOpen}>
                                    Preview
                                </Button>
                                <Button type="submit" variant="contained" color="primary" sx={{ ml: 2 }}>
                                    Save
                                </Button>
                            </Box>
                        </form>
                    </Paper>
                </Grid>
                <PreviewModal
                    open={isPreviewOpen}
                    onClose={handlePreviewClose}
                    modelDisplayName={modelDisplayName}
                    apiEndpoint={apiEndpoint}
                    fields={fields}
                    actionLabels={actionLabels}
                />
            </Grid>
        </div>
    );
};

export default Builder;

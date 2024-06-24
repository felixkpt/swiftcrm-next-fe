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
import FieldComponent from './FieldComponent';
import PreviewModal from './PreviewModal';
import { appConfig, publish } from '@/app/components/baseComponents/utils/helpers';
import { ActionLabelType, FieldType, FieldValidation } from '../types';
import { inputTypes } from '../utils/constants';
import useFieldState from '../hooks/useFieldState';
import ActionLabelsComponent from './ActionLabelsComponent';
import { useParams } from 'next/navigation';
import axios from 'axios';
import getConstants from '../AutoModel/getConstants';

type Props = {
    saveAndGenerateModel: (data: any) => void;
};

const Builder: React.FC<Props> = ({ saveAndGenerateModel }) => {
    const params = useParams();
    const { API_ENDPOINT } = getConstants;
    const pageId = params?.pageId;

    const [modelName, setModelName] = useState('');
    const [modelURI, setModelURI] = useState('');
    const [apiEndpoint, setApiEndpoint] = useState('');

    const [actionLabels, setActionLabels] = useState<ActionLabelType[]>([
        { key: '', label: '', actionType: '', show: true, required: true, isRequired: true },
    ]);

    const { fields, setFields, setFieldValidations, allFieldsAreValid, handleAddField, fieldValidations } = useFieldState();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(appConfig.api.url(`${API_ENDPOINT}/${pageId}`));
                const data = response.data;
                setModelName(data.modelName);
                setModelURI(data.modelURI);
                setApiEndpoint(data.apiEndpoint);
                setActionLabels(data.action_labels);

                const mappedFields: FieldType[] = data.fields.map((field: any) => {
                    if (field.name === 'id' || field.name === 'created_at' || field.name === 'updated_at') return null;

                    return {
                        id: field.id,
                        name: { value: field.name, required: field.isRequired },
                        type: { value: field.type, required: field.isRequired },
                        defaultValue: { value: field.defaultValue, required: field.isRequired },
                        isRequired: { value: field.isRequired, required: field.isRequired },
                        isVisibleInList: { value: true, required: field.isVisibleInList },
                        isVisibleInSingleView: { value: true, required: field.isVisibleInSingleView },
                        label: { value: field.label, required: field.isRequired },
                        dataType: { value: field.dataType, required: field.isRequired },
                        isUnique: { value: false, required: field.isUnique },
                        dropdownSource: { value: field.dropdownSource || '', required: field.isRequired },
                        dropdownDependsOn: { value: field.dropdownDependsOn || [], required: field.isRequired },
                    };
                }).filter((itm: any) => itm);

                setFields(mappedFields);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [API_ENDPOINT, pageId, setFields]);

    const [actionLabelValidations, setActionLabelValidations] = useState<boolean[]>([]);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [hasDoneSubmission, setHasDoneSubmission] = useState(false);
    const [isBasicInfoValid, setIsBasicInfoValid] = useState(true);

    const handlePreviewOpen = () => {
        setIsPreviewOpen(true);
    };

    const handlePreviewClose = () => {
        setIsPreviewOpen(false);
    };

    function updateFieldValidation(updatedField: FieldType): FieldValidation {
        return {
            name: !updatedField.name.required || updatedField.name.value.trim() !== '',
            type: !updatedField.type.required || updatedField.type.value.trim() !== '',
            label: !updatedField.label.required || updatedField.label.value.trim() !== '',
            dataType: !updatedField.dataType.required || updatedField.dataType.value.trim() !== '',
            defaultValue: !updatedField.defaultValue.required || updatedField.defaultValue.value.trim() !== '',
            dropdownSource: !updatedField.dropdownSource.required || updatedField.dropdownSource.value.trim() !== '',
            dropdownDependsOn: !updatedField.dropdownDependsOn.required || updatedField.dropdownDependsOn.value.length !== 0,
        };
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setHasDoneSubmission(true);

        const isModelNameValid = modelName.trim() !== '';
        const isModelURIValid = modelURI.trim() !== '';
        const isApiEndpointValid = apiEndpoint.trim() !== '';
        setIsBasicInfoValid(isModelNameValid && isModelURIValid && isApiEndpointValid);

        const fieldValidations = fields.map(field => {
            return updateFieldValidation(field);
        });

        setFieldValidations(fieldValidations);

        setActionLabelValidations([]);
        actionLabels.forEach((action) => {
            setActionLabelValidations((prev) => {
                const newValidations = [...prev];
                if (action.key === '' || action.actionType === '') {
                    newValidations.push(false);
                } else {
                    newValidations.push(true);
                }
                return newValidations;
            });
        });

        const isValid = isModelNameValid && isModelURIValid && isApiEndpointValid
            && allFieldsAreValid(fieldValidations) && actionLabelValidations.every(Boolean);

        if (!isValid) {
            publish('autoNotification', { error: { message: 'Please fill in all required fields.' }, type: 'error' });
            return;
        }

        saveAndGenerateModel({
            modelName,
            modelURI,
            apiEndpoint,
            fields,
            actionLabels,
            pageId,
        });
    };

    return (
        <Grid justifyContent="center" mt={4}>
            <Grid item xs={10}>
                <Paper elevation={3} sx={{ padding: 3 }}>
                    <Typography variant="h5" gutterBottom>
                        Auto Page Builder
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <BasicInfoComponent
                            modelName={modelName}
                            setModelName={setModelName}
                            modelURI={modelURI}
                            setModelURI={setModelURI}
                            apiEndpoint={apiEndpoint}
                            setApiEndpoint={setApiEndpoint}
                            isValid={isBasicInfoValid}
                            hasDoneSubmission={hasDoneSubmission}
                        />
                        <Divider sx={{ my: 2 }} />
                        <FieldComponent
                            inputTypes={inputTypes}
                            fields={fields}
                            setFields={setFields}
                            fieldValidity={fieldValidations}
                            hasDoneSubmission={hasDoneSubmission}
                            onAddField={handleAddField}
                            updateFieldValidation={updateFieldValidation}
                            setFieldValidations={setFieldValidations}
                        />
                        <Divider sx={{ my: 2 }} />
                        <Box mb={2}>
                            <ActionLabelsComponent
                                actionLabels={actionLabels}
                                setActionLabels={setActionLabels}
                                hasDoneSubmission={hasDoneSubmission}
                                actionLabelValidations={actionLabelValidations}
                            />
                        </Box>
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
                modelName={modelName}
                apiEndpoint={apiEndpoint}
                fields={fields}
                actionLabels={actionLabels}
            />
        </Grid>
    );
};

export default Builder;

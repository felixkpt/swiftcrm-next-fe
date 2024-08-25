'use client';
import { useState, useEffect, useRef } from 'react';
import { publish, subscribe } from '@/app/components/baseComponents/utils/pubSub';
import { formatErrors } from '../../utils/formatErrors';
import SubmitButton from '../../Buttons/SubmitButton';
import { HttpVerb, ServerModelOptionType } from '@/app/components/baseComponents/types';
import { FillableType } from '../BaseAutoModel/types';
import DynamicDropdown from './Dropdowns/DynamicDropdown';
import DropdownDependsOn from './Dropdowns/DropdownDependsOn';
import { useSearchParams } from 'next/navigation';

type Props = {
    modelID: string;
    modelNameSingular: string;
    method: HttpVerb;
    endpoint: string;
    fillable: FillableType[];
    serverModelOptions: ServerModelOptionType;
};

const AutoCreateOrUpdateRecord: React.FC<Props> = ({ modelID, modelNameSingular, method, endpoint, fillable, serverModelOptions }) => {
    // State variables for managing form and record data
    const [key, setKey] = useState(0);
    const [localTitle, setLocalTitle] = useState(`Create ${modelNameSingular}`);
    const [record, setRecord] = useState<Record<string, any> | null>(null);
    const [formData, setFormData] = useState<Record<string, string | undefined> | null>(null);
    const [localEndpoint, setLocalEndpoint] = useState(endpoint);
    const [localMethod, setLocalMethod] = useState(method);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [errors, setErrors] = useState<Record<string, string | null>>({});
    const [generalError, setGeneralError] = useState<string | null>(null);

    // Refs for managing textarea elements
    const textareaRefs = useRef<Record<string, HTMLTextAreaElement | null>>({});

    // Hook for accessing search params from the URL
    const params = useSearchParams();

    // Initial effect to set form values based on URL params
    useEffect(() => {
        if (params) {
            setInitialFormValues();
        }
    }, [params]);

    // Break down and refactor the initial form setup into a separate function
    function setInitialFormValues() {
        const transformedFillable: Record<string, any> = {};

        const formDat = fillable.reduce((acc: Record<string, string | undefined>, field) => {
            const value = field?.value || undefined;

            // Initialize formData with URL parameters if they match fillable fields
            let getValue = params.get(field.name);
            if (params.get('model_action') === 'createOrUpdate') {
                transformedFillable[field.name] = getValue;
            }

            acc[field.name] = getValue || value;
            return acc;
        }, {});

        // Delaying the updates to ensure proper state handling
        setTimeout(() => setKey(key + 1), 200);
        setTimeout(() => {
            setFormData(formDat);
            if (Object.keys(transformedFillable).length > 0) {
                setRecord(transformedFillable);
            }
        }, 0);
    }

    // Effect for updating the title based on whether a record exists
    useEffect(() => {
        if (record && record.id) {
            setLocalTitle(`Edit ${modelNameSingular} #${record.id}`);
        } else {
            setLocalTitle(`Create ${modelNameSingular}`);
        }
    }, [record, modelNameSingular]);

    // Effect to manage dependencies in fillable fields
    useEffect(() => {
        if (fillable && fillable.length > 0) {
            fillable.forEach(handleFieldDependencies);
        }
    }, [fillable]);

    // Break down the dependency handling logic into a separate function
    function handleFieldDependencies(field: FillableType) {
        const dropdownDependsOn = field.dropdownDependsOn;
        if (dropdownDependsOn) {
            dropdownDependsOn.forEach((dependency) => {
                fillable.forEach((innerField) => {
                    if (innerField.dropdownSource === dependency) {
                        if (innerField.onChangeUpdateList) {
                            const newList = [...innerField.onChangeUpdateList, dependency].filter((value, index, array) => array.indexOf(value) === index);
                            innerField.onChangeUpdateList = newList;
                        } else {
                            innerField.onChangeUpdateList = [dependency];
                        }
                    }
                });
            });
        }
    }

    // Handle form input changes and trigger dependent updates
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | { value: unknown }>) => {
        const { name, value } = e.target as { name: string; value: string };

        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: null,
        }));

        // Publish changes for dependent fields
        const field = fillable.find((f) => f.name === name);
        if (field?.onChangeUpdateList) {
            field.onChangeUpdateList.forEach((updateField) => {
                publish(`${modelID}_update_${updateField}`, { [field.name]: value });
            });
        }
    };

    // Handle form submission and reset states
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        setErrors({});
        setGeneralError(null);
        publish(`${modelID}_submit`, { method: localMethod, action: localEndpoint, formData, modelID });
    };

    // Effect to handle responses after submitting the form
    useEffect(() => {
        const handleResponse = ({ status, data, error }: any) => {
            setLoading(false);
            if (status === 200) {
                resetForm();
                setMessage(data.message || 'Action was successful.');
            } else {
                handleError(error);
            }
        };

        // Subscribe to form submission response events
        const unsubscribe = subscribe(`${modelID}_done`, handleResponse);
        return () => unsubscribe();
    }, [modelID, method]);

    // Separate function to reset form data and states
    function resetForm() {
        setRecord(null);
        setInitialFormValues();
        setLocalMethod(method);
    }

    // Separate function to handle different error types
    function handleError(error: any) {
        if (typeof error === 'string') {
            setGeneralError(error);
        } else if (typeof error === 'object') {
            if (error.detail && Array.isArray(error.detail)) {
                const formattedErrors = formatErrors.fastAPI(error.detail);
                if (formattedErrors) {
                    setErrors(formattedErrors);
                }
            } else if (error.detail?.type) {
                const errorType = error.detail.type;
                const errorMsg = error.detail.msg;
                if (errorType === 'unique_constraint') {
                    setGeneralError(errorMsg);
                } else {
                    setGeneralError('An unknown error occurred.');
                }
            } else {
                setGeneralError('An unknown error occurred.');
            }
        } else {
            setGeneralError('An unknown error occurred.');
        }
    }

    // Effect to handle new and edit record events
    useEffect(() => {
        const handleEditRecord = ({ record, endpoint, method }: { record: Record<string, string>; endpoint: string, method: HttpVerb }) => {
            setRecord(record);
            setMessage(null);
            setErrors({});
            setGeneralError(null);
            setLocalMethod(method || 'PUT');
            setFormData(fillable.reduce((acc, field) => {
                acc[field.name] = record[field.name] || '';
                return acc;
            }, {} as Record<string, string>));
            setLocalEndpoint(endpoint);
        };

        const handleNewRecord = () => {
            resetForm();
            setInitialFormValues();
            setLocalEndpoint(endpoint);
        };

        // Subscribe to new and edit record events
        const unsubscribeNew = subscribe(`${modelID}_newRecord`, handleNewRecord);
        const unsubscribeEdit = subscribe(`${modelID}_editRecord`, handleEditRecord);

        return () => {
            unsubscribeNew();
            unsubscribeEdit();
        };
    }, [modelID, method, endpoint, fillable]);

    // Effect to handle auto-growing textareas when a record is loaded
    useEffect(() => {
        if (record) {
            Object.keys(textareaRefs.current).forEach((key) => {
                const textarea = textareaRefs.current[key];
                if (textarea) {
                    autoGrowTextarea({ currentTarget: textarea } as React.ChangeEvent<HTMLTextAreaElement>);
                }
            });
        }
    }, [record]);

    // Function to auto-grow textarea based on content
    const autoGrowTextarea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const target = e.currentTarget;
        target.style.height = "60px";
        target.style.height = `${target.scrollHeight}px`;
    };

    return (
        <>
            <div className="border-b-2 border-b-gray-400 mb-5">
                <h3 className="font-bold text-lg text-gray-300">{localTitle}</h3>
            </div>

            {generalError && <p className="text-red-700 my-1">{generalError}</p>}
            <form onSubmit={handleSubmit} key={key}>
                {key > 0 && formData && fillable.map((field) => {
                    return (
                        <div key={field.name} className="mb-4">
                            <label htmlFor={field.name} className="block text-gray-500 text-sm font-bold mb-2">
                                {field.label || field.name}:
                            </label>
                            {field.type === 'textarea' ? (
                                <textarea
                                    id={field.name}
                                    name={field.name}
                                    value={formData[field.name]}
                                    onChange={handleChange}
                                    onInput={autoGrowTextarea}
                                    aria-label={field.label}
                                    ref={(el) => {
                                        if (el) {
                                            textareaRefs.current[field.name] = el;
                                        }
                                    }}
                                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline ${errors[field.name] ? 'border-red-700' : ''}`}
                                />
                            ) : field.type === 'dropdown' && field.dropdownDependsOn ? (
                                <DropdownDependsOn
                                    modelID={modelID}
                                    name={field.name}
                                    value={formData[field.name]}
                                    onChange={handleChange}
                                    dropdownSource={field.dropdownSource || ''}
                                    dropdownDependsOn={field.dropdownDependsOn}
                                    record={record}
                                />
                            ) :
                                field.type === 'dropdown' ? (
                                    <DynamicDropdown
                                        modelID={modelID}
                                        name={field.name}
                                        value={formData[field.name]}
                                        onChange={handleChange}
                                        dropdownSource={field.dropdownSource || ''}
                                        record={record}
                                        serverModelOptions={serverModelOptions}
                                    />
                                ) : (
                                    <input
                                        type={field.type}
                                        id={field.name}
                                        name={field.name}
                                        value={formData[field.name]}
                                        onChange={handleChange}
                                        aria-label={field.label}
                                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline h-fit ${errors[field.name] ? 'border-red-700' : ''}`}
                                    />
                                )}
                            {errors[field.name] && (
                                <p className="text-red-700 text-sm mt-1">{errors[field.name]}</p>
                            )}
                        </div>
                    )
                })}
                <SubmitButton title="Submit" loading={loading} />
            </form>
        </>
    );
};

export default AutoCreateOrUpdateRecord;

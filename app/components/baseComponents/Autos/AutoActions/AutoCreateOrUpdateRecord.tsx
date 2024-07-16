'use client';
import { useState, useEffect, useRef } from 'react';
import { publish, subscribe } from '../../utils/helpers';
import { formatErrors } from '../../utils/formatErrors';
import SubmitButton from '../../Buttons/SubmitButton';
import { HttpVerb } from '@/app/components/baseComponents/types';
import { FillableType } from '../BaseAutoModel/types';
import DynamicDropdown from './DynamicDropdown';
import DropdownDependsOn from './DropdownDependsOn';

type Props = {
    componentId: string;
    modelNameSingular: string;
    method: HttpVerb;
    endpoint: string;
    fillable: FillableType[];
};

const setInitials = (fillable: FillableType[]) => {
    return fillable.reduce((acc, field) => {
        acc[field.name] = field.value || '';
        return acc;
    }, {} as Record<string, string>);
};

const AutoCreateOrUpdateRecord: React.FC<Props> = ({ componentId, modelNameSingular, method, endpoint, fillable }) => {
    const [localTitle, setLocalTitle] = useState(`Create ${modelNameSingular}`);
    const [record, setRecord] = useState<any>(null);
    const initialfillable = fillable;
    const [formData, setFormData] = useState(setInitials(initialfillable));
    const [localEndpoint, setLocalEndpoint] = useState(endpoint);
    const [localMethod, setLocalMethod] = useState(method);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [errors, setErrors] = useState<Record<string, string | null>>({});
    const [generalError, setGeneralError] = useState<string | null>(null);

    const textareaRefs = useRef<Record<string, HTMLTextAreaElement | null>>({});

    useEffect(() => {
        if (record) {
            setLocalTitle(`Edit ${modelNameSingular} #${record.id}`);
        } else {
            setLocalTitle(`Create ${modelNameSingular}`);
        }
    }, [record, modelNameSingular]);

    const [dependencyValues, setDependencyValues] = useState<Record<string, string>>({});
    useEffect(() => {

        if (fillable && fillable.length > 0) {
            fillable.forEach((field) => {
                console.log('dropdownSource:', field.dropdownSource)
                const dropdownDependsOn = field.dropdownDependsOn
                console.log('dropdownDependsOn:', dropdownDependsOn)
                if (dropdownDependsOn) {
                    dropdownDependsOn.forEach((dependency) => {
                        fillable.map((field) => {
                            if (field.dropdownSource === dependency) {
                                if (field.onChangeUpdateList) {

                                    const newList = [...field.onChangeUpdateList, dependency].filter((value, index, array) => array.indexOf(value) === index)
                                    field.onChangeUpdateList = newList
                                } else {
                                    field.onChangeUpdateList = [dependency]
                                }
                            }
                        })
                    })
                }

            })

        }
    }, [fillable]);

    console.log('fillable:::::', fillable)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: null,
        }));

        // Check if the field has onChangeUpdateList
        const field = fillable.find((f) => f.name === name);
        if (field?.onChangeUpdateList) {
            field.onChangeUpdateList.forEach((updateField) => {
                console.log(`${componentId}_update_${updateField}`, value)
                publish(`${componentId}_update_${updateField}`, { [field.name]: value });
            });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        setErrors({});
        setGeneralError(null);
        publish(`${componentId}_submit`, { method: localMethod, action: localEndpoint, formData });
    };

    useEffect(() => {
        const handleResponse = ({ status, data, error }: any) => {
            setLoading(false);
            if (status === 200) {
                setRecord(null);
                setLocalMethod(method);
                setMessage(data.message || 'Action was successful.');
            } else {
                if (typeof error === 'string') {
                    setGeneralError(error);
                } else if (typeof error === 'object') {
                    if (error.detail && Array.isArray(error.detail)) {
                        const formattedErrors = formatErrors.fastAPI(error.detail);
                        if (formattedErrors) {
                            setErrors(formattedErrors);
                        }
                    } else if (error.detail && error.detail.type) {
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
        };

        const unsubscribe = subscribe(`${componentId}_done`, handleResponse);
        return () => {
            unsubscribe();
        };
    }, [componentId, method]);

    useEffect(() => {
        const handleEditRecord = ({ record, endpoint, method }: { record: Record<string, string>; endpoint: string, method: HttpVerb }) => {
            setRecord(record);
            setMessage(null);
            setErrors({});
            setGeneralError(null);
            setLocalMethod(method || 'PUT');
            setFormData(
                fillable.reduce((acc, field) => {
                    acc[field.name] = record[field.name] || '';
                    return acc;
                }, {} as Record<string, string>)
            );
            setLocalEndpoint(endpoint);
        };

        const handleNewRecord = () => {
            setMessage(null);
            setErrors({});
            setGeneralError(null);
            setLocalMethod(method);
            setFormData(setInitials(initialfillable));
            setLocalEndpoint(endpoint);
        };

        const unsubscribeNew = subscribe(`${componentId}_newRecord`, handleNewRecord);
        const unsubscribeEdit = subscribe(`${componentId}_editRecord`, handleEditRecord);

        return () => {
            unsubscribeNew();
            unsubscribeEdit();
        };
    }, [componentId, method, endpoint, fillable]);

    useEffect(() => {
        if (record) {
            Object.keys(textareaRefs.current).forEach(key => {
                const textarea = textareaRefs.current[key];
                if (textarea) {
                    autoGrowTextarea({ currentTarget: textarea } as React.ChangeEvent<HTMLTextAreaElement>);
                }
            });
        }
    }, [record]);

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
            <form onSubmit={handleSubmit}>
                {fillable.map((field) => (
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
                                componentId={componentId}
                                name={field.name}
                                value={formData[field.name]}
                                onChange={handleChange}
                                dropdownSource={field.dropdownSource || ''}
                                dropdownDependsOn={field.dropdownDependsOn}
                            />
                        ) :
                            field.type === 'dropdown' ? (
                                <DynamicDropdown
                                    componentId={componentId}
                                    name={field.name}
                                    value={formData[field.name]}
                                    onChange={handleChange}
                                    dropdownSource={field.dropdownSource || ''}
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
                ))}
                <SubmitButton title="Submit" loading={loading} />
            </form>
        </>
    );
};

export default AutoCreateOrUpdateRecord;

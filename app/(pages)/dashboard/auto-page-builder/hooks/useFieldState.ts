import { useState } from 'react';
import { FieldType, FieldValidation } from '../types';
import { newField, newValidation } from '../utils/constants';

const useFieldState = () => {
    const [fields, setFields] = useState<FieldType[]>([
        { ...newField, },
    ]);
    const [fieldValidations, setFieldValidations] = useState<FieldValidation[]>([]);

    const allFieldsAreValid = (fieldValidations: FieldValidation[]) => {
        return !fieldValidations.some(validation => {
            return Object.values(validation).some(value => value === false);
        });
    };

    const handleAddField = (name: string, type: string, dataType: string) => {
        const newFieldWithType = {
            ...newField,
            name: { value: name, required: newField.name.required, },
            type: { value: type, required: newField.type.required, },
            dataType: { value: dataType, required: newField.dataType.required },
        };
        setFields([...fields, newFieldWithType]);
        setFieldValidations([...fieldValidations, newValidation]);
    };

    const handleRemoveField = (index: number) => {
        setFields((prevFields) => prevFields.filter((_, i) => i !== index));
        setFieldValidations((prevValidations) => prevValidations.filter((_, i) => i !== index));
    };

    return { fields, setFields, setFieldValidations, allFieldsAreValid, handleRemoveField, fieldValidations, handleAddField };
};

export default useFieldState;

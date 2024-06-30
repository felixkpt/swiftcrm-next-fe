import { useState } from 'react'
import { FieldType, FieldValidation } from '../types';
import { newField, newValidation } from '../utils/constants';

const useFieldState = () => {
    // State to hold the fields configuration
    const [fields, setFields] = useState<FieldType[]>([newField]);

    // State to hold the validation status of fields
    const [fieldValidations, setFieldValidations] = useState<FieldValidation[]>([]);

    // Function to check if all fields are valid
    const allFieldsAreValid = (fieldValidations: FieldValidation[]) => {
        return !fieldValidations.some(validation => {
            return Object.values(validation).some(value => value === false);
        });
    };

    // Handler to add a new field
    const handleAddField = () => {
        setFields([...fields, newField]);
        setFieldValidations([...fieldValidations, newValidation]);
    };

    // Handler to remove a field by index
    const handleRemoveField = (index: number) => {
        setFields((prevFields) => prevFields.filter((_, i) => i !== index));
        setFieldValidations((prevValidations) => prevValidations.filter((_, i) => i !== index));
    };

    return { fields, setFields, setFieldValidations, allFieldsAreValid, handleRemoveField, fieldValidations, handleAddField }

}

export default useFieldState
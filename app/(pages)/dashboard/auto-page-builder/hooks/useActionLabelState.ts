import { useState } from 'react';
import { ActionLabelType, ActionLabelTypeValidation } from '../types';
import { actionLabelsActions, newActionLabel } from '../utils/constants';
import { makeActionLabelValidation } from '../utils/helpers';

const useActionLabelState = () => {
    // State to hold the action labels configuration
    const [actionLabels, setActionLabels] = useState<ActionLabelType[]>([newActionLabel]);

    // State to hold the validation status of action labels
    const [actionLabelValidations, setActionLabelValidations] = useState<ActionLabelTypeValidation[]>([]);

    // Function to check if all action labels are valid
    const allActionLabelsAreValid = (actionLabelValidations: ActionLabelTypeValidation[]) => {
        return !actionLabelValidations.some(validation => {
            return Object.values(validation).some(value => value === false);
        });
    };

    // Handler to add a new action label
    const handleAddActionLabel = () => {
        if (actionLabels.length >= actionLabelsActions.length) return;

        setActionLabels([...actionLabels, { ...newActionLabel }]);
        setActionLabelValidations([...actionLabelValidations, makeActionLabelValidation({ ...newActionLabel })]);
    };

    // Handler to remove an action label by index
    const handleRemoveActionLabel = (index: number) => {
        setActionLabels((prevLabels) => prevLabels.filter((_, i) => i !== index));
        setActionLabelValidations((prevValidations) => prevValidations.filter((_, i) => i !== index));
    };

    return {
        actionLabels,
        setActionLabels,
        actionLabelValidations,
        setActionLabelValidations,
        allActionLabelsAreValid,
        handleRemoveActionLabel,
        handleAddActionLabel
    };
};

export default useActionLabelState;

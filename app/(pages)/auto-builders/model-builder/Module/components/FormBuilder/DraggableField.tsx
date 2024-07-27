import { Grid, IconButton, MenuItem, Select, TextField } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { CommonDataTypes, InputType, RecordType } from "@/app/components/baseComponents/Autos/BaseAutoModel/types";
import { AutoPageBuilderType } from "../../utils/backendTypes";
import Modal from "./Modal/Modal";

const ItemTypes = {
    FIELD: 'field',
};

type DraggableFieldProps = {
    field: any;
    index: number;
    selectedField: any;
    onClick: () => void;
    moveField: (dragIndex: number, hoverIndex: number) => void;
    handleRemoveField: (index: number) => void;
    inputTypes: InputType[];
    dropdownSourcesList: RecordType[];
    fieldValidations: any;
    handleFieldChange: (index: number, field: any) => void;
    hasDoneSubmission: boolean;
};

const DraggableField = ({
    field,
    index,
    selectedField,
    onClick,
    moveField,
    handleRemoveField,
    inputTypes,
    dropdownSourcesList,
    fieldValidations,
    handleFieldChange,
    hasDoneSubmission,
}: DraggableFieldProps) => {

    const inputType = field.type.value;
    const commonDataTypes = inputTypes.find(type => type.name === field.type.value)?.commonDataTypes || [];
    const fieldValidation = fieldValidations[index];

    const ref = useRef<HTMLDivElement>(null);
    const [, drop] = useDrop({
        accept: ItemTypes.FIELD,
        hover(item: { index: number }) {
            if (!ref.current) {
                return;
            }
            const dragIndex = item.index;
            const hoverIndex = index;

            if (dragIndex === hoverIndex) {
                return;
            }

            moveField(dragIndex, hoverIndex);
            item.index = hoverIndex;
        },
    });

    const [{ isDragging }, drag] = useDrag({
        type: ItemTypes.FIELD,
        item: { type: ItemTypes.FIELD, index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    drag(drop(ref));

    return (
        <div
            ref={ref}
            onClick={onClick}
            style={{
                opacity: isDragging ? 0.5 : 1,
                cursor: 'move',
                gridColumnEnd: `span ${field.desktopWidth.value}`,
                marginBottom: '16px',
            }}
        >
            <Grid container spacing={2} mt={2} p={1} style={{ border: `${'solid 1px rgb(23 69 145 / 50%)'}` }} >
                {renderField(field, handleRemoveField, index, inputType, commonDataTypes, fieldValidation, handleFieldChange, dropdownSourcesList, hasDoneSubmission)}
            </Grid>
        </div>
    );
};

const renderModal = (
    inputType: string,
    commonDataTypes: CommonDataTypes[],
    field: any,
    index: number,
    fieldValidation: any,
    handleFieldChange: (index: number, field: any) => void,
    dropdownSourcesList: AutoPageBuilderType[],
    hasDoneSubmission: boolean
) => (
    <Grid item>
        <Modal
            inputType={inputType}
            commonDataTypes={commonDataTypes}
            field={field}
            index={index}
            fieldValidation={fieldValidation}
            handleFieldChange={handleFieldChange}
            dropdownSourcesList={dropdownSourcesList}
            hasDoneSubmission={hasDoneSubmission}
        />
    </Grid>
);


const renderRemoveField = (handleRemoveField: (index: number) => void, index: number) => (
    <Grid item>
        <IconButton aria-label="delete" onClick={() => handleRemoveField(index)}>
            <DeleteIcon />
        </IconButton>
    </Grid>
);

const renderField = (
    field: any,
    handleRemoveField: (index: number) => void,
    index: number,
    inputType: string,
    commonDataTypes: CommonDataTypes[],
    fieldValidation: any,
    handleFieldChange: (index: number, field: any) => void,
    dropdownSourcesList: AutoPageBuilderType[],
    hasDoneSubmission: boolean
) => {
    const options = [
        { id: '1', value: 'Item 1' },
        { id: '2', value: 'Item 2' },
        { id: '3', value: 'Item 3' }
    ];

    switch (field.type.value) {
        case 'input':
            if (field.dataType.value === 'date') {
                return (
                    <>
                        <Grid item xs={10} pr={1}>
                            <TextField
                                label={field.label.value || field.name.value}
                                type="date"
                                variant="outlined"
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid container xs={2} justifyContent={'end'} alignItems={'center'}>
                            {renderModal(inputType, commonDataTypes, field, index, fieldValidation, handleFieldChange, dropdownSourcesList, hasDoneSubmission)}
                            {renderRemoveField(handleRemoveField, index)}
                        </Grid>
                    </>
                );
            } else if (field.dataType.value === 'datetime' || field.dataType.value === 'timestamp') {
                return (
                    <>
                        <Grid item xs={10} pr={1}>
                            <TextField
                                label={field.label.value || field.name.value}
                                type="datetime-local"
                                variant="outlined"
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid container xs={2} justifyContent={'end'} alignItems={'center'}>
                            {renderModal(inputType, commonDataTypes, field, index, fieldValidation, handleFieldChange, dropdownSourcesList, hasDoneSubmission)}
                            {renderRemoveField(handleRemoveField, index)}
                        </Grid>
                    </>
                );
            } else if (field.dataType.value === 'time') {
                return (
                    <>
                        <Grid item xs={10} pr={1}>
                            <TextField
                                label={field.label.value || field.name.value}
                                type="time"
                                variant="outlined"
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid container xs={2} justifyContent={'end'} alignItems={'center'}>
                            {renderModal(inputType, commonDataTypes, field, index, fieldValidation, handleFieldChange, dropdownSourcesList, hasDoneSubmission)}
                            {renderRemoveField(handleRemoveField, index)}
                        </Grid>
                    </>
                );
            } else if (['integer', 'biginteger', 'float', 'double', 'decimal'].includes(field.dataType.value)) {
                return (
                    <>
                        <Grid item xs={10} pr={1}>
                            <TextField
                                label={field.label.value || field.name.value}
                                variant="outlined"
                                fullWidth
                                type="number"
                            />
                        </Grid>
                        <Grid container xs={2} justifyContent={'end'} alignItems={'center'}>
                            {renderModal(inputType, commonDataTypes, field, index, fieldValidation, handleFieldChange, dropdownSourcesList, hasDoneSubmission)}
                            {renderRemoveField(handleRemoveField, index)}
                        </Grid>
                    </>
                );
            } else {
                return (
                    <>
                        <Grid item xs={10} pr={1}>
                            <TextField label={field.label.value || field.name.value} variant="outlined" fullWidth />
                        </Grid>
                        <Grid container xs={2} justifyContent={'end'} alignItems={'center'}>
                            {renderModal(inputType, commonDataTypes, field, index, fieldValidation, handleFieldChange, dropdownSourcesList, hasDoneSubmission)}
                            {renderRemoveField(handleRemoveField, index)}
                        </Grid>
                    </>
                );
            }
        case 'textarea':
            return (
                <>
                    <Grid item xs={10} pr={1}>
                        <TextField
                            label={field.label.value || field.name.value}
                            variant="outlined"
                            multiline
                            rows={4}
                            fullWidth
                        />
                    </Grid>
                    <Grid container xs={2} justifyContent={'end'} alignItems={'center'}>
                        {renderModal(inputType, commonDataTypes, field, index, fieldValidation, handleFieldChange, dropdownSourcesList, hasDoneSubmission)}
                        {renderRemoveField(handleRemoveField, index)}
                    </Grid>
                </>
            );
        case 'dropdown':
            return (
                <>
                    <Grid item xs={10} pr={1}>
                        <small>{field.label.value || field.name.value}</small>
                        <Select
                            label={field.label.value || field.name.value}
                            variant="outlined"
                            fullWidth
                            readOnly
                        >
                            {options.map((option, i) => (
                                <MenuItem key={i} value={option.id}>
                                    {option.value}
                                </MenuItem>
                            ))}
                        </Select>
                    </Grid>
                    <Grid container xs={2} justifyContent={'end'} alignItems={'center'}>
                        {renderModal(inputType, commonDataTypes, field, index, fieldValidation, handleFieldChange, dropdownSourcesList, hasDoneSubmission)}
                        {renderRemoveField(handleRemoveField, index)}
                    </Grid>
                </>
            );
        default:
            return null;
    }
};

export default DraggableField;

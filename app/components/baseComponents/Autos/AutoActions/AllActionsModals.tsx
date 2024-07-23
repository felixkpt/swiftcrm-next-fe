import React from 'react';
import AutoModal from '../AutoModal';
import AutoCreateOrUpdateRecord from './AutoCreateOrUpdateRecord';
import AutoViewRecord from './AutoViewRecord';
import AutoUpdateStatus from './AutoUpdateStatus';
import AutoDeleteRecord from './AutoDeleteRecord';
import AutoArchiveRecord from './AutoArchiveRecord';
import { FillableType } from '../BaseAutoModel/types';

type Props = {
    modelID: string;
    modelNameSingular: string;
    apiEndpoint: string;
    fillableFields: FillableType[];
};

const AllActionsModals: React.FC<Props> = ({ modelID, modelNameSingular, apiEndpoint, fillableFields }) => {

    const fillableFieldsFiltered = fillableFields.filter((v) => !v.hidden)
    return (
        <div>
            <AutoModal modelID={`${modelID}CreateOrUpdate`} title={modelNameSingular}>
                <AutoCreateOrUpdateRecord
                    modelID={`${modelID}CreateOrUpdate`}
                    modelNameSingular={modelNameSingular}
                    method="POST"
                    endpoint={apiEndpoint}
                    fillable={fillableFieldsFiltered}
                />
            </AutoModal>
            <AutoModal modelID={`${modelID}View`} title={modelNameSingular}>
                <AutoViewRecord
                    modelID={`${modelID}View`}
                    modelNameSingular={modelNameSingular}
                    method="GET"
                    endpoint={apiEndpoint}
                    fillable={fillableFieldsFiltered}
                />
            </AutoModal>
            <AutoModal modelID={`${modelID}UpdateStatus`} title={modelNameSingular}>
                <AutoUpdateStatus
                    modelID={`${modelID}UpdateStatus`}
                    modelNameSingular={modelNameSingular}
                    method="GET"
                    endpoint={apiEndpoint}
                    fillable={fillableFieldsFiltered}
                />
            </AutoModal>
            <AutoModal modelID={`${modelID}Archive`} title={modelNameSingular}>
                <AutoArchiveRecord
                    modelID={`${modelID}Archive`}
                    modelNameSingular={modelNameSingular}
                    method="POST"
                    endpoint={apiEndpoint}
                    fillable={fillableFieldsFiltered}
                />
            </AutoModal>
            <AutoModal modelID={`${modelID}Delete`} title={modelNameSingular}>
                <AutoDeleteRecord
                    modelID={`${modelID}Delete`}
                    modelNameSingular={modelNameSingular}
                    method="DELETE"
                    endpoint={apiEndpoint}
                    fillable={fillableFieldsFiltered}
                />
            </AutoModal>
        </div>
    );
};

export default AllActionsModals;

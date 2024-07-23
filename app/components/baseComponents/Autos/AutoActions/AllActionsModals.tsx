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
            <AutoModal modelID={`${modelID}_CreateOrUpdate`} title={modelNameSingular}>
                <AutoCreateOrUpdateRecord
                    modelID={`${modelID}_CreateOrUpdate`}
                    modelNameSingular={modelNameSingular}
                    method="POST"
                    endpoint={apiEndpoint}
                    fillable={fillableFieldsFiltered}
                />
            </AutoModal>
            <AutoModal modelID={`${modelID}_View`} title={modelNameSingular}>
                <AutoViewRecord
                    modelID={`${modelID}_View`}
                    modelNameSingular={modelNameSingular}
                    method="GET"
                    endpoint={apiEndpoint}
                    fillable={fillableFieldsFiltered}
                />
            </AutoModal>
            <AutoModal modelID={`${modelID}_UpdateStatus`} title={modelNameSingular}>
                <AutoUpdateStatus
                    modelID={`${modelID}_UpdateStatus`}
                    modelNameSingular={modelNameSingular}
                    method="GET"
                    endpoint={apiEndpoint}
                    fillable={fillableFieldsFiltered}
                />
            </AutoModal>
            <AutoModal modelID={`${modelID}_Archive`} title={modelNameSingular}>
                <AutoArchiveRecord
                    modelID={`${modelID}_Archive`}
                    modelNameSingular={modelNameSingular}
                    method="POST"
                    endpoint={apiEndpoint}
                    fillable={fillableFieldsFiltered}
                />
            </AutoModal>
            <AutoModal modelID={`${modelID}_Delete`} title={modelNameSingular}>
                <AutoDeleteRecord
                    modelID={`${modelID}_Delete`}
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

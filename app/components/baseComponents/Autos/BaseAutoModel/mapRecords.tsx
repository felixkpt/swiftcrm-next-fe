
import AutoRecordActionSection from '@/app/components/baseComponents/AutoTableModes/Default/AutoRecordActionSection';
import { ActionListType } from '@/app/components/baseComponents/Autos/BaseAutoModel/types';

const mapRecords = (
  records: any,
  MODEL_ID: string,
  apiEndpoint: string,
  ACTION_LABELS: Partial<ActionListType>,
  ACTION_TYPE: string,
  isSingle?: boolean,
) => {
  return records.map((record: any) => ({
    ...record,
    action: (
      <AutoRecordActionSection
        key={record.id}
        componentId={MODEL_ID}
        record={record}
        recordEndpoint={isSingle ? apiEndpoint : `${apiEndpoint}/${record.id}/`}
        actionLabels={ACTION_LABELS}
        actionType={ACTION_TYPE}
      />
    ),
  }));
};

export default mapRecords;

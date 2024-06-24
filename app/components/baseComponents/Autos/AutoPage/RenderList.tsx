import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import AutoHeader from '../AutoHeader';
import DefaultAutoTableHeaderActions from '@/app/components/baseComponents/AutoTableModes/Default/AutoTableHeaderActions';
import AutoTable from '../AutoTable';
import { appConfig } from '@/app/components/baseComponents/utils/helpers';
import useAutoPostDone from '@/app/components/baseComponents/hooks/useAutoPostDone';
import { ActionHandlersInterface, ActionListType, FillableType, HeaderType, KnownActionsType } from '../BaseAutoModel/types';
import DefaultActionHandlers from '../BaseAutoModel/ActionHandlers';
import AllActionsModals from '../AutoActions/AllActionsModals';
import AllActionsAutoPosts from '../AutoActions/AllActionsAutoPosts';

type Props = {
  modelName: string;
  modelNamePlural: string;
  componentId: string;
  apiEndpoint: string;
  fillableFields: FillableType[];
  headers: HeaderType[];
  AutoTableHeaderActions?: React.ElementType;
  ActionHandlers?: new (componentId: string, apiEndpoint: string) => ActionHandlersInterface;
  mapRecords: (records: any[]) => any[];
  actionLabels: Partial<ActionListType>;
};

const Renderer: React.FC<Props> = ({
  modelName,
  modelNamePlural,
  componentId,
  apiEndpoint,
  fillableFields,
  headers,
  AutoTableHeaderActions,
  ActionHandlers,
  mapRecords,
  actionLabels,
}) => {
  const defaultActionHandlers = ActionHandlers ? new ActionHandlers(componentId, apiEndpoint) : new DefaultActionHandlers(componentId, apiEndpoint);

  const [headerTitle, setHeaderTitle] = useState(`${modelNamePlural.charAt(0).toUpperCase() + modelNamePlural.slice(1)} list`)

  const router = useRouter();
  const [records, setRecords] = useState<any[]>([]);
  const { response } = useAutoPostDone({ componentId });

  const fetchRecords = async () => {
    try {
      const response = await axios.get(appConfig.api.url(apiEndpoint));

      const hasMetaData = response?.data?.metadata
      const data = response?.data
      if (hasMetaData) {
        setHeaderTitle(data.metadata.title);
        setRecords(mapRecords(data.results || []));
        }else {
        setRecords(mapRecords(data || []));
      }

    } catch (error) {
      console.error(`Error fetching ${modelNamePlural}:`, error);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  useEffect(() => {
    if (response && response.status === 200) {
      fetchRecords();
    }
  }, [response]);

  const handleRecordAction = useCallback((e: Event) => {
    const target = e.target as HTMLElement;

    const action = target.getAttribute('data-action') as KnownActionsType;
    const dataTarget = target.getAttribute('data-target') as KnownActionsType;
    const recordId = target.getAttribute('data-id');

    if (action && recordId) {
      e.preventDefault();
      const record = records.find(record => record.id.toString() === recordId);
      if (record) {
        const actionConfig = actionLabels[action];
        if (actionConfig) {
          if (actionConfig.actionType === 'modal') {
            defaultActionHandlers[action](record, headers);
          } else if (actionConfig.actionType === 'navigation') {
            router.push(dataTarget);
          }
        } else {
          console.error(`Action configuration for "${action}" not found.`);
        }
      } else {
        console.error(`Record with ID ${recordId} not found.`);
      }
    } else {
    }
  }, [records, actionLabels, defaultActionHandlers, apiEndpoint]);

  useEffect(() => {
    const handleTableClick = (e: Event) => {
      handleRecordAction(e);
    };

    const componentTable = document.getElementById(`${componentId}AutoTable`);
    if (componentTable) {
      componentTable.addEventListener('click', handleTableClick);
      return () => {
        componentTable.removeEventListener('click', handleTableClick);
      };
    }
  }, [records, handleRecordAction]);

  // Filter out objects where singleViewOnly is true
  let filteredHeaders = headers.filter(item => item.isVisibleInList);

  return (
    <div>
      <AutoHeader
        headerTitle={headerTitle}
        description=""
        componentId={`${componentId}CreateOrUpdate`}
        showCreateButton
      />
      <AutoTable
        records={records}
        headers={filteredHeaders}
        componentId={componentId}
        AutoTableHeaderActions={AutoTableHeaderActions || DefaultAutoTableHeaderActions}
      />
      <AllActionsModals
        componentId={componentId}
        modelName={modelName}
        apiEndpoint={apiEndpoint}
        fillableFields={fillableFields}
      />
      <AllActionsAutoPosts componentId={componentId} />
    </div>
  );
};

export default Renderer;

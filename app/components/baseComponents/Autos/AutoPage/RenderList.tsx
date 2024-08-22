'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
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
import useAutoResolveEndPointPlaceholders from '../BaseAutoModel/useAutoResolveEndPointPlaceholders';
import { GeneralResultType, MetadataType, ServerModelOptionType, } from '../../types';
import mapRecords from '../BaseAutoModel/mapRecords';
import { getEndpoint } from '../BaseAutoModel/autoFunctions';

type Props = {
  modelID: string;
  modelNameSingular: string;
  modelNamePlural: string;
  fillableFields: FillableType[];
  headers: HeaderType[];
  AutoTableHeaderActions?: React.ElementType;
  ActionHandlers?: new (modelID: string, apiEndpoint: string) => ActionHandlersInterface;
  serverRecords: GeneralResultType[];
  revalidateServerRecords: any;
  serverMetadata: any;
  actionLabels: Partial<ActionListType>;
  actionType: any;
  apiEndpoint: string;
  serverModelOptions: ServerModelOptionType;
  createUri?: string;
};

const Renderer: React.FC<Props> = ({
  modelID,
  modelNameSingular,
  modelNamePlural,
  fillableFields,
  headers,
  AutoTableHeaderActions,
  ActionHandlers,
  serverRecords,
  revalidateServerRecords,
  serverMetadata,
  actionLabels,
  actionType,
  apiEndpoint,
  serverModelOptions,
  createUri,
}) => {
  const defaultActionHandlers = ActionHandlers ? new ActionHandlers(modelID, apiEndpoint) : new DefaultActionHandlers(modelID, apiEndpoint);
  apiEndpoint = useAutoResolveEndPointPlaceholders({ apiEndpoint });

  const handleActionClick = (actionKey: KnownActionsType, record: any, recordEndpoint: string) => {
    const actionConfig = actionLabels[actionKey]
    if (actionConfig) {
      const dataTarget = getEndpoint(actionLabels, record, recordEndpoint, actionKey);
      if (actionConfig.actionType === 'modal') {
        defaultActionHandlers[actionKey](record, headers);
      } else if (actionConfig.actionType === 'navigation') {
        if (dataTarget) {
          router.push(dataTarget);
        }
      }
    } else {
      console.warn(`Action label for ${actionKey} is undefined.`);
    }
  };


  const [headerTitle, setHeaderTitle] = useState(`${modelNamePlural.charAt(0).toUpperCase() + modelNamePlural.slice(1)} list`);
  const [records, setRecords] = useState<GeneralResultType[]>(mapRecords(serverRecords || [], modelID, apiEndpoint, actionLabels, actionType, handleActionClick));
  const [metadata, setMetaData] = useState<MetadataType>(serverMetadata);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const { response } = useAutoPostDone({ modelID });
  const router = useRouter();

  const onPageNumberChange = (page: number) => {
    setFilters({ ...filters, page });
  };

  const fetchRecords = async (revalidate = false) => {

    if (revalidate === false) {
      if (!apiEndpoint || (records.length && Object.keys(filters).length === 0)) return;
    }

    try {
      const resp = await axios.get(appConfig.api.url(apiEndpoint), { params: filters });
      const data = resp?.data;
      const hasMetaData = typeof data?.metadata !== 'undefined';

      if (hasMetaData) {
        setRecords(mapRecords(data.records || [], modelID, apiEndpoint, actionLabels, actionType, handleActionClick));
        if (data.metadata) {
          setHeaderTitle(data.metadata?.title || headerTitle);
          setMetaData(data.metadata);
        }
      } else {
        setRecords(mapRecords(data || [], modelID, apiEndpoint, actionLabels, actionType, handleActionClick));
        setMetaData(null);
      }

    } catch (error) {
      console.error(`Error fetching ${modelNamePlural}:`, error);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [apiEndpoint, filters]);

  useEffect(() => {
    if (response && response.status === 200) {
      console.log('Revalidating server records...')
      fetchRecords(true);
      revalidateServerRecords();
    }
  }, [response]);

  const handleSearch = (searchFilters: Record<string, any>) => {
    setFilters({ ...filters, ...searchFilters, page: 1 });
  };

  const handleExport = (filters: Record<string, any>) => {
    console.log('Export filters:', filters);
  };

  let filteredHeaders = headers.filter(item => item.isVisibleInList);

  return (
    <div className='autotableWrapper w-full overflow-auto'>
      <AutoHeader
        headerTitle={headerTitle}
        description=""
        modelID={`${modelID}_CreateOrUpdate`}
        showCreateButton
        createUri={createUri}
      />
      <AutoTable
        records={records}
        fillableFields={fillableFields}
        headers={filteredHeaders}
        modelID={modelID}
        apiEndpoint={apiEndpoint}
        metadata={metadata}
        onPageNumberChange={onPageNumberChange}
        AutoTableHeaderActions={AutoTableHeaderActions || DefaultAutoTableHeaderActions}
        handleSearch={handleSearch}
        handleExport={handleExport}
        serverModelOptions={serverModelOptions}
      />
      <AllActionsModals
        modelID={modelID}
        modelNameSingular={modelNameSingular}
        apiEndpoint={apiEndpoint}
        fillableFields={fillableFields}
        serverModelOptions={serverModelOptions}
      />
      <AllActionsAutoPosts modelID={modelID} />
    </div>
  );
};

export default Renderer;

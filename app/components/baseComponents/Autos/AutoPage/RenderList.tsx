'use client';

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
import useAutoResolveEndPointPlaceholders from '../BaseAutoModel/useAutoResolveEndPointPlaceholders';
import mapRecords from '@/app/(pages)/dashboard/auto-page-builder/AutoModel/mapRecords';
import { GeneralResultType, MetadataType } from '../../types';

type Props = {
  modelNameSingular: string;
  modelNamePlural: string;
  componentId: string;
  apiEndpoint: string;
  fillableFields: FillableType[];
  headers: HeaderType[];
  AutoTableHeaderActions?: React.ElementType;
  ActionHandlers?: new (componentId: string, apiEndpoint: string) => ActionHandlersInterface;
  serverRecords: GeneralResultType[];
  revalidateServerRecords: any;
  serverMetadata: any;
  actionLabels: Partial<ActionListType>;
  actionType: any;
  createUri?: string;
};

const Renderer: React.FC<Props> = ({
  modelNameSingular,
  modelNamePlural,
  componentId,
  apiEndpoint,
  fillableFields,
  headers,
  AutoTableHeaderActions,
  ActionHandlers,
  serverRecords,
  revalidateServerRecords,
  serverMetadata,
  actionLabels,
  actionType,
  createUri,
}) => {
  const defaultActionHandlers = ActionHandlers ? new ActionHandlers(componentId, apiEndpoint) : new DefaultActionHandlers(componentId, apiEndpoint);
  apiEndpoint = useAutoResolveEndPointPlaceholders({ apiEndpoint });

  const [headerTitle, setHeaderTitle] = useState(`${modelNamePlural.charAt(0).toUpperCase() + modelNamePlural.slice(1)} list`);
  const [records, setRecords] = useState<GeneralResultType[]>(serverRecords);
  const [metadata, setMetaData] = useState<MetadataType>(serverMetadata);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const { response } = useAutoPostDone({ componentId });
  const router = useRouter();

  const onPageNumberChange = (page: number) => {
    setFilters({ ...filters, page });
  };

  const fetchRecords = async () => {
    if (!apiEndpoint) return;

    try {
      const response = await axios.get(appConfig.api.url(apiEndpoint), { params: filters });
      const data = response?.data;
      const hasMetaData = typeof data?.metadata !== 'undefined';

      if (hasMetaData) {
        setRecords(mapRecords(data.records || [], componentId, apiEndpoint, actionLabels, actionType));
        if (data.metadata) {
          setHeaderTitle(data.metadata?.title || headerTitle);
          setMetaData(data.metadata);
        }
      } else {
        setRecords(mapRecords(data || [], componentId, apiEndpoint, actionLabels, actionType));
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
      fetchRecords();
      revalidateServerRecords();
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

  const handleSearch = (searchFilters: Record<string, any>) => {
    setFilters({ ...filters, ...searchFilters });
  };

  const handleExport = (filters: Record<string, any>) => {
    console.log('Export filters:', filters);
  };

  let filteredHeaders = headers.filter(item => item.isVisibleInList);

  return (
    <div>
      <AutoHeader
        headerTitle={headerTitle}
        description=""
        componentId={`${componentId}CreateOrUpdate`}
        showCreateButton
        createUri={createUri}
      />
      <AutoTable
        records={records}
        fillableFields={fillableFields}
        headers={filteredHeaders}
        componentId={componentId}
        apiEndpoint={apiEndpoint}
        metadata={metadata}
        onPageNumberChange={onPageNumberChange}
        AutoTableHeaderActions={AutoTableHeaderActions || DefaultAutoTableHeaderActions}
        handleSearch={handleSearch}
        handleExport={handleExport}
      />
      <AllActionsModals
        componentId={componentId}
        modelNameSingular={modelNameSingular}
        apiEndpoint={apiEndpoint}
        fillableFields={fillableFields}
      />
      <AllActionsAutoPosts componentId={componentId} />
    </div>
  );
};

export default Renderer;

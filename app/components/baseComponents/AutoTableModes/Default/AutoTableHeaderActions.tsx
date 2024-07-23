'use client';
import React, { useState, ChangeEvent } from 'react';
import { publish } from '@/app/components/baseComponents/utils/pubSub';
import SubmitButton from '../../Buttons/SubmitButton';
import { FillableType } from '../../Autos/BaseAutoModel/types';
import DropdownDependsOn from '../../Autos/AutoActions/DropdownDependsOn';
import DynamicDropdown from '../../Autos/AutoActions/DynamicDropdown';
import { MetadataType } from '../../types';

type Props = {
  fillableFields: FillableType[];
  modelID: string;
  metadata: MetadataType
  handleSearch: (filters: Record<string, any>) => void;
  handleExport: (filters: Record<string, any>) => void;
};

const AutoTableHeaderActions: React.FC<Props> = ({ fillableFields, modelID, metadata, handleSearch, handleExport }) => {
  const [filters, setFilters] = useState<Record<string, any>>({});

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));

    // Check if the field has onChangeUpdateList
    const field = fillableFields.find((f) => f.name === name);
    if (field?.onChangeUpdateList) {
      field.onChangeUpdateList.forEach((updateField) => {
        console.log(`${modelID}_update_${updateField}`, value)
        publish(`${modelID}_update_${updateField}`, { [field.name]: value });
      });
    }
  };

  console.log(fillableFields.filter(field => field.type === 'input' || field.type === 'dropdown'))
  return (
    <div className="p-2 shadow-lg rounded-md">
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <div className="flex-grow">
          {/* records metadata */}
          <div className='flex justify-end items-center text-sm'>
            {metadata?.total_records !== undefined && metadata.total_records >= 0 ?
              <>
              {metadata?.total_records} records
              </> :
              <>
              </>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-6 xl:grid-cols-8 gap-4 items-center">
            {fillableFields.filter(field => field.type === 'input' || field.type === 'dropdown').map((field) => (
              field.isVisibleInList && (
                <div key={field.name} className="mb-4 flex flex-col justify-center">
                  <label className="block text-sm text-start font-medium text-gray-700 mb-2">
                   {field.label || field.name}
                  </label>
                  {field.type === 'input' && (
                    <input
                      type="text"
                      name={field.name}
                      value={filters[field.name] || ''}
                      onChange={handleInputChange}
                      className="block w-full px-1 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  )}
                  {field.type === 'dropdown' && field.dropdownDependsOn ? (
                    <DropdownDependsOn
                      modelID={modelID}
                      name={field.name}
                      value={filters[field.name] || ''}
                      onChange={handleInputChange}
                      dropdownSource={field.dropdownSource || ''}
                      dropdownDependsOn={field.dropdownDependsOn}
                      size='sm'
                    />
                  ) : field.type === 'dropdown' ? (
                    <DynamicDropdown
                      modelID={modelID}
                      name={field.name}
                      value={filters[field.name] || ''}
                      onChange={handleInputChange}
                      dropdownSource={field.dropdownSource || ''}
                      size='sm'
                    />
                  ) : null}
                </div>
              )
            ))}

            {/* start action btns */}
            <div className='ml-10 mb-4 flex flex-col justify-center items-center'>
              <div className='flex gap-1'>
                <div className="flex flex-col justify-center items-center">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    &nbsp;
                  </label>
                  <SubmitButton title="Search" loading={false} onClick={() => handleSearch(filters)} size='sm' />
                </div>
                <div className="flex flex-col justify-center items-center">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    &nbsp;
                  </label>
                  <SubmitButton title="Export" type='info' loading={false} onClick={() => handleExport(filters)} size='sm' />
                </div>
              </div>
            </div>
            {/* end action btns */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutoTableHeaderActions;

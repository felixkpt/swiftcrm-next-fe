import React, { useState, useEffect } from 'react';
import { MenuItem, FormControl, InputLabel, Select } from '@mui/material';

interface DependentDropdownProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { [key: string]: string[] };
  dependencies: string[];
  dependentValues: { [key: string]: string };
}

const DependentDropdown: React.FC<DependentDropdownProps> = ({
  label,
  value,
  onChange,
  options,
  dependencies,
  dependentValues,
}) => {
  const [filteredOptions, setFilteredOptions] = useState<string[]>([]);

  useEffect(() => {
    const filterOptions = () => {
      const dependentKey = dependencies.map(dep => dependentValues[dep]).join('_');
      setFilteredOptions(options[dependentKey] || []);
    };

    filterOptions();
  }, [dependencies, dependentValues, options]);

  return (
    <FormControl fullWidth variant="outlined" margin="normal">
      <InputLabel>{label}</InputLabel>
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value as string)}
        label={label}
      >
        {filteredOptions.map((option, index) => (
          <MenuItem key={index} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default DependentDropdown;

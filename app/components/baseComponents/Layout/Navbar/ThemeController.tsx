import React, { useEffect, useState } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

const ThemeController = ({ themeAnchorEl, isThemeMenuOpen, handleThemeMenuClose }) => {
  const themeMenuId = 'theme-menu';
  const [theme, setTheme] = useState('default');

  useEffect(() => {
    // Load the theme from localStorage if it exists
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);

  const handleThemeChange = (theme) => {
    setTheme(theme);
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    handleThemeMenuClose();
  };

  return (
    <Menu
      anchorEl={themeAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={themeMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isThemeMenuOpen}
      onClose={handleThemeMenuClose}
    >
      <MenuItem onClick={() => handleThemeChange('light')}>Light</MenuItem>
      <MenuItem onClick={() => handleThemeChange('dark')}>Dark</MenuItem>
      <MenuItem onClick={() => handleThemeChange('system')}>System Default</MenuItem>
    </Menu>
  );
};

export default ThemeController;

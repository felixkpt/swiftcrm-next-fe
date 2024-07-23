import React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

interface ProfileMenuProps {
  anchorEl: null | HTMLElement;
  isMenuOpen: boolean;
  handleMenuClose: () => void;
  handleThemeMenuOpen: (event: React.MouseEvent<HTMLElement>) => void;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({ anchorEl, isMenuOpen, handleMenuClose, handleThemeMenuOpen }) => {
  const menuId = 'primary-search-account-menu';

  return (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
      sx={{ width: '400px!important' }}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
      <MenuItem onClick={handleThemeMenuOpen}>Theme</MenuItem>
    </Menu>
  );
};

export default ProfileMenu;

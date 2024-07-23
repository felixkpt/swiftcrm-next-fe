import React, { useState } from 'react';
import { useAppState } from '@/app/context/AppStateProvider';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Menu from '@mui/material/Menu';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import MenuIcon from '@mui/icons-material/Menu';
import { CircularProgress } from '@mui/material';

const NotificationsMenu: React.FC = () => {
  const { events, hasPendingEvents } = useAppState();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isOpen = Boolean(anchorEl);

  // Extract notifications from events
  const notifications = Object.entries(events).flatMap(([uuid, eventList]) =>
    eventList.map(event => ({
      id: uuid + '-' + event.name, // Unique key for each notification
      text: `Event ${event.name} occurred with status ${event.status}`,
    }))
  );

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        onClick={handleMenuOpen}
        size="large"
        aria-label="show new notifications"
        color="inherit"
      >
        {
          !hasPendingEvents ?
            <Badge badgeContent={notifications.length} color="error">
              <NotificationsIcon />
            </Badge>
            :
            <CircularProgress
              size={24}
              sx={{
                color: 'white',
                ":hover": { color: 'white' }
              }}
            />
        }
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={isOpen}
        onClose={handleMenuClose}
      >
        <List>
          {notifications.length > 0 ? (
            notifications.map(notification => (
              <ListItem key={notification.id}>
                {notification.text}
              </ListItem>
            ))
          ) : (
            <ListItem>No new notifications</ListItem>
          )}
          <Divider />
          <MenuItem onClick={handleMenuClose}>See all notifications</MenuItem>
        </List>
      </Menu>
    </div>
  );
};

export default NotificationsMenu;

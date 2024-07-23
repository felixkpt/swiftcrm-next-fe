import React, { useState } from 'react';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import MailIcon from '@mui/icons-material/Mail';
import Menu from '@mui/material/Menu';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';

const messages = [
  { id: 1, text: 'New message from John', avatar: 'J' },
  { id: 2, text: 'Reminder: Meeting at 3 PM', avatar: 'A' },
  { id: 3, text: 'Your report is ready', avatar: 'S' },
];

const MessagesMenu: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isOpen = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        size="large"
        aria-label="show new mails"
        color="inherit"
        onClick={handleMenuOpen}
      >
        <Badge badgeContent={messages.length}
          color="error">
          <MailIcon />
        </Badge>
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
          {messages.map((message) => (
            <ListItem key={message.id} button>
              <ListItemAvatar>
                <Avatar>{message.avatar}</Avatar>
              </ListItemAvatar>
              <ListItemText primary={message.text} />
            </ListItem>
          ))}
          <Divider />
          <MenuItem onClick={handleMenuClose}>See all messages</MenuItem>
        </List>
      </Menu>
    </div>
  );
};

export default MessagesMenu;

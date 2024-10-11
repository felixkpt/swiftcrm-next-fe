import { useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import Link from 'next/link';

type NestedListProps = {
    parentTitle: string;
    items: Array<{ title: string; href: string }>;
};

const NestedList = ({ parentTitle, items }: NestedListProps) => {
    const [open, setOpen] = useState(false);

    const handleClick = () => {
        setOpen(!open);
    };

    return (
        <>
            <ListItem disablePadding sx={{ display: 'block' }}>
                <ListItemButton onClick={handleClick} sx={{ minHeight: 48, justifyContent: 'initial', px: 2.5 }}>
                    <ListItemIcon sx={{ minWidth: 0, mr: 3, justifyContent: 'center' }}>
                        <InboxIcon />
                    </ListItemIcon>
                    <ListItemText primary={parentTitle} />
                    {open ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    {items.map((item, index) => (
                        <ListItemButton key={index} sx={{ pl: 4 }}>
                            <ListItemIcon>
                                <MailIcon />
                            </ListItemIcon>
                            <Link href={item.href} passHref>
                                <ListItemText primary={item.title} />
                            </Link>
                        </ListItemButton>
                    ))}
                </List>
            </Collapse>
        </>
    );
};

export default NestedList;

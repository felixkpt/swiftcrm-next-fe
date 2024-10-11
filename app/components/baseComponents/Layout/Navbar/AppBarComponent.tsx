import { styled, useTheme } from '@mui/material/styles';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import MenuIcon from '@mui/icons-material/Menu';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import AutoModeIcon from '@mui/icons-material/AutoMode';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MoreIcon from '@mui/icons-material/MoreVert';
import ExitToApp from '@mui/icons-material/ExitToApp';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { ThemeContext } from './ThemeContext';
import { appConfig } from '../../utils/helpers';
import { useContext, useEffect, useState } from 'react';
import MessagesMenu from './MessagesMenu';
import NotificationsMenu from './NotificationsMenu';
import { Grid, Typography } from '@mui/material';
import { drawerWidth } from '../Sidebar/SideNav';

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const menuPaperStyles = { minWidth: 200 };

export default function AppBarComponent({ open, handleDrawerOpen }: { open: boolean, handleDrawerOpen: () => void }) {
    const { switchTheme, themeMode, prefers, setPrefers } = useContext(ThemeContext)!;
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState<null | HTMLElement>(null);
    const [themeAnchorEl, setThemeAnchorEl] = useState<null | HTMLElement>(null);

    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
    const isThemeMenuOpen = Boolean(themeAnchorEl);

    useEffect(() => {
        const query = window.matchMedia('(prefers-color-scheme: dark)');
        const updateSystemTheme = (e: MediaQueryListEvent) => {
            setPrefers(e.matches ? 'dark' : 'light');
        };
        query.addEventListener('change', updateSystemTheme);
        updateSystemTheme(query);
        return () => query.removeEventListener('change', updateSystemTheme);
    }, [themeMode]);

    useEffect(() => {
        switchTheme(prefers);
    }, [prefers]);

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleThemeMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setThemeAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleThemeMenuClose = () => {
        setThemeAnchorEl(null);
    };

    const handleThemeChange = (theme: 'light' | 'dark' | 'default') => {
        switchTheme(theme);
        handleThemeMenuClose();
    };

    const handleLogout = () => {
        // Add your logout logic here
        console.log("Logging out...");
    };

    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
            PaperProps={{ style: menuPaperStyles }}
        >
            <MessagesMenu />
            <NotificationsMenu />
            <MenuItem onClick={handleProfileMenuOpen}>
                <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    color="inherit"
                >
                    <AccountCircle />
                </IconButton>
                <Typography variant="body2" sx={{ marginLeft: 1 }}>Profile</Typography>
            </MenuItem>
        </Menu>
    );

    const themeMenuId = 'theme-menu';
    const renderThemeMenu = (
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
            PaperProps={{ style: menuPaperStyles }}
        >
            <MenuItem onClick={handleProfileMenuOpen}>
                <IconButton
                    size="large"
                    aria-label="account of current user"
                    color="inherit"
                >
                    <AccountCircle />
                </IconButton>
                <Typography variant="body2" sx={{ marginLeft: 1 }}>Profile</Typography>
            </MenuItem>
            <MenuItem>
                <Grid container flexDirection="column" alignItems="flex-start">
                    <Typography variant="body2">Select Theme</Typography>
                    <Grid item>
                        <Tooltip title="Light Mode">
                            <IconButton
                                color={themeMode === 'light' ? 'primary' : 'default'}
                                aria-label="light mode"
                                onClick={() => handleThemeChange('light')}
                            >
                                <LightModeIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Dark Mode">
                            <IconButton
                                color={themeMode === 'dark' ? 'primary' : 'default'}
                                aria-label="dark mode"
                                onClick={() => handleThemeChange('dark')}
                            >
                                <DarkModeIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="System Default">
                            <IconButton
                                color={themeMode === 'default' ? 'primary' : 'default'}
                                aria-label="system default"
                                onClick={() => handleThemeChange(prefers)}
                            >
                                <AutoModeIcon />
                            </IconButton>
                        </Tooltip>
                    </Grid>
                </Grid>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
                <IconButton
                    size="large"
                    aria-label="logout"
                    color="inherit"
                >
                    <ExitToApp />
                </IconButton>
                <Typography variant="body2" sx={{ marginLeft: 1 }}>Logout</Typography>
            </MenuItem>
        </Menu>
    );

    return (
        <AppBar position="fixed" open={open}>
            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={handleDrawerOpen}
                    edge="start"
                    sx={{
                        marginRight: 5,
                        ...(open && { display: 'none' }),
                    }}
                >
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" noWrap component="div">
                    {appConfig.name}
                </Typography>
                <div style={{ flexGrow: 1 }} />
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <MessagesMenu />
                    <NotificationsMenu />
                    <IconButton
                        aria-label="change theme"
                        aria-controls={themeMenuId}
                        aria-haspopup="true"
                        onClick={handleThemeMenuOpen}
                        color="inherit"
                    >
                        <MoreIcon />
                    </IconButton>
                </div>
            </Toolbar>
            {renderMobileMenu}
            {renderThemeMenu}
        </AppBar>
    );
}

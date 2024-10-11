'use client'
// BaseLayout.tsx
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Footer from './Footer';
import { AppStateProvider } from '@/app/context/AppStateProvider';
import AppBarComponent from './Navbar/AppBarComponent';
import { appConfig, defaultTheme } from '../utils/helpers';
import { useState } from 'react';
import { ThemeProviderComponent } from './Navbar/ThemeContext';
import SideNav from './Sidebar/SideNav';

type Props = {
    children: React.ReactNode
}

const BaseLayout = ({ children }: Props) => {

    const theme = useTheme();
    const [open, setOpen] = useState(true);
    const [userExplicitClose, setUserExplicitClose] = useState(false)

    const handleDrawerOpen = () => {
        setOpen(true);
        setUserExplicitClose(false)
    };

    return (
        <AppStateProvider client_id={appConfig.uuid()}>
            <ThemeProviderComponent defaultTheme={defaultTheme}>

                <Box sx={{ display: 'flex' }}>
                    <CssBaseline />
                    <AppBarComponent open={open} handleDrawerOpen={handleDrawerOpen} />
                    <SideNav open={open} setOpen={setOpen} setUserExplicitClose={setUserExplicitClose} userExplicitClose={userExplicitClose} theme={theme}  />
                    <Box component="main" sx={{ flexGrow: 1, p: 1, overflow: 'hidden' }}>
                        <div className="flex min-h-screen mt-[36px] w-full">
                            <main className="flex-1 p-1 md:p-3 w-full">{children}</main>
                        </div>
                        <Footer />
                    </Box>
                </Box>
            </ThemeProviderComponent>
        </AppStateProvider>
    );
}

export default BaseLayout
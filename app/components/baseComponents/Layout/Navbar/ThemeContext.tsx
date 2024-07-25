// ThemeContext.tsx
import { createTheme, ThemeProvider } from '@mui/material/styles';
import React, { createContext, SetStateAction, useMemo, useState } from 'react';

type ThemeModeType = 'light' | 'dark' | 'default';
type ThemeContextType = {
    themeMode: ThemeModeType;
    switchTheme: (mode: ThemeModeType) => void;
    prefers: 'light' | 'dark';
    setPrefers: React.Dispatch<SetStateAction<'light' | 'dark'>>;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const ThemeProviderComponent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [themeMode, setThemeMode] = useState<ThemeModeType>('default');
    const [prefers, setPrefers] = useState<'light' | 'dark'>('light');

    const switchTheme = (mode: ThemeModeType) => {
        setThemeMode(mode);
    };

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode: themeMode === 'default' ? prefers : themeMode,
                },
            }),
        [themeMode, prefers]
    );

    return (
        <ThemeContext.Provider value={{ themeMode, switchTheme, prefers, setPrefers }}>
            <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </ThemeContext.Provider>
    );
};

export { ThemeProviderComponent, ThemeContext };

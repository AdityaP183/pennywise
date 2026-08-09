import * as React from "react";

export const ThemeProviderContext = React.createContext(undefined);

export const useTheme = () => {
    const context = React.useContext(ThemeProviderContext);

    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }

    return context;
};

import React, { createContext, useContext, useState, ReactNode } from "react";

interface ColorContextProps {
    selectedColor: string | null;
    setSelectedColor: React.Dispatch<React.SetStateAction<string | null>>;
}

const ColorContext = createContext<ColorContextProps | undefined>(undefined);

export const ColorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    return <ColorContext.Provider value={{ selectedColor, setSelectedColor }}>{children}</ColorContext.Provider>;
};

export const useColorContext = () => {
    const context = useContext(ColorContext);
    if (!context) {
        throw new Error("useColorContext must be used within a ColorProvider");
    }
    return context;
};

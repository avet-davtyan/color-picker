import React, { createContext, useContext, useState, ReactNode } from "react";
import Tools from "../Tools";

interface ToolContextProps {
    selectedTool: Tools;
    setSelectedTool: React.Dispatch<React.SetStateAction<Tools>>;
}

const ToolContext = createContext<ToolContextProps | undefined>(undefined);

export const ToolProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [selectedTool, setSelectedTool] = useState<Tools>(Tools.None);
    return <ToolContext.Provider value={{ selectedTool, setSelectedTool }}>{children}</ToolContext.Provider>;
};

export const useToolContext = () => {
    const context = useContext(ToolContext);
    if (!context) {
        throw new Error("useToolContext must be used within a ToolProvider");
    }
    return context;
};

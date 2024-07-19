import React, { createContext, useContext, useState, ReactNode } from "react";

interface ImageContextProps {
    imageFile: Blob | null;
    setImageFile: React.Dispatch<React.SetStateAction<Blob | null>>;
}

const ImageContext = createContext<ImageContextProps | undefined>(undefined);

export const ImageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [imageFile, setImageFile] = useState<Blob | null>(null);
    return <ImageContext.Provider value={{ imageFile, setImageFile }}>{children}</ImageContext.Provider>;
};

export const useImageContext = () => {
    const context = useContext(ImageContext);
    if (!context) {
        throw new Error("useImageContext must be used within an ImageProvider");
    }
    return context;
};

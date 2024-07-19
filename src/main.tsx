import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ImageProvider } from "./context/ImageContext.tsx";
import { ToolProvider } from "./context/ToolContext.tsx";
import { ColorProvider } from "./context/ColorContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <ImageProvider>
            <ToolProvider>
                <ColorProvider>
                    <App />
                </ColorProvider>
            </ToolProvider>
        </ImageProvider>
    </React.StrictMode>
);

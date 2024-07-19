import Header from "./Header";
import { useState } from "react";
import Canvas from "./Canvas";
import "./App.css";
import Tools from "./Tools";
import { useToolContext } from "./context/ToolContext";
function App() {
    const { selectedTool } = useToolContext();
    const dropperIsSelected = () => selectedTool === Tools.ColorDropper && "picker";

    return (
        <div className={`main-back ${dropperIsSelected()}`}>
            <div>
                <Header />
                <Canvas />
            </div>
        </div>
    );
}

export default App;

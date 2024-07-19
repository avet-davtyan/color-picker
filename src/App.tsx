import Header from "./Header";
import Canvas from "./Canvas";
import Tools from "./Tools";
import { useToolContext } from "./context/ToolContext";
import "./App.css";

function App() {
    const { selectedTool } = useToolContext();
    const dropperIsSelected = selectedTool === Tools.ColorDropper;

    return (
        <div className={`main-back ${dropperIsSelected && "picker"}`}>
            <div>
                <Header />
                <Canvas />
            </div>
        </div>
    );
}

export default App;

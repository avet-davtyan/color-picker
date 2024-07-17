import Header from './Header';
import { useState } from 'react';
import Canvas from './Canvas';
import './App.css';
import Tools from './Tools';

function App() {
    const [imageFile, setImageFile] = useState<Blob | null>(null);
    const [color, setColor] = useState<string | null>(null);
    const [selectedTool, setSelectedTool] = useState<Tools>(Tools.None);

    return (
        <div className='main-back'>
            <Header
                setImageFile={setImageFile}
                color={color}
                setSelectedTool={setSelectedTool}
            />
            <Canvas
                imageFile={imageFile}
                color={color}
                setColor={setColor}
                selectedTool={selectedTool}
            />
        </div>
    );
}

export default App;

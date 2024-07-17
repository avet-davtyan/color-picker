import Header from './Header';
import { useState } from 'react';
import Canvas from './Canvas';
import './App.css';
import Tools from './Tools';
import IconColorPicker from './assets/IconColorPicker.svg';

function App() {
    const [imageFile, setImageFile] = useState<Blob | null>(null);
    const [color, setColor] = useState<string | null>(null);
    const [selectedTool, setSelectedTool] = useState<Tools>(Tools.None);

    return (
        <div
            className='main-back'
            style={{
                cursor:
                    selectedTool === Tools.ColorDropper
                        ? `url(${IconColorPicker}) 0 16, auto`
                        : 'default',
            }}
        >
            <Header
                setImageFile={setImageFile}
                color={color}
                selectedTool={selectedTool}
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

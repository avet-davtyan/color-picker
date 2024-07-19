import { ChangeEvent, useRef } from "react";
import "./Header.css";
import Tools from "../Tools";
import { useColorContext } from "../context/ColorContext";
import { useImageContext } from "../context/ImageContext";
import { useToolContext } from "../context/ToolContext";

const Header = ({}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const { selectedColor } = useColorContext();
    const { imageFile, setImageFile } = useImageContext();
    const { selectedTool, setSelectedTool } = useToolContext();
    const dropperIsSelected = selectedTool === Tools.ColorDropper;

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
        const files = event.target.files;
        if (!files || files.length === 0) return;
        setImageFile(files[0]);
        setSelectedTool(Tools.None);
    };

    const handleInputButtonClick = (): void => {
        inputRef.current?.click();
    };

    const handleColorDropperButtonClick = (): void => {
        if (!imageFile) return;
        setSelectedTool((prevState) => (prevState === Tools.ColorDropper ? Tools.None : Tools.ColorDropper));
    };

    return (
        <div className="header">
            <button
                className={`header-button ${dropperIsSelected && "selected"}`}
                disabled={!imageFile}
                onClick={handleColorDropperButtonClick}
            >
                <img src={"IconColorPicker.svg"} alt="Color Picker" />
            </button>
            <p className="color">{selectedColor}</p>
            <div>
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    multiple={false}
                    style={{ display: "none" }}
                />
                <button onClick={handleInputButtonClick} className="header-button">
                    Choose an image
                </button>
            </div>
        </div>
    );
};

export default Header;
